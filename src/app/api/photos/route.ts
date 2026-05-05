import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import sharp from 'sharp';
import { createClient } from '@/lib/supabase/server';
import { isValidSchoolYear, schoolYearFromDate } from '@/lib/school-year';

export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BUCKET = 'event-photos';
const THUMB_WIDTH = 400;
const MEDIUM_WIDTH = 1200;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const schoolYear = searchParams.get('school_year');
    const eventId = searchParams.get('event_id');
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 500);
    const offset = Number(searchParams.get('offset')) || 0;
    const includeUnpublished = searchParams.get('include_unpublished') === 'true';

    let query = supabase
      .from('photos')
      .select('*, event:events(id, title, date)')
      .order('date_taken', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }
    if (schoolYear) query = query.eq('school_year', schoolYear);
    if (eventId === 'none') query = query.is('event_id', null);
    else if (eventId) query = query.eq('event_id', Number(eventId));

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching photos:', error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('photos GET error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const storagePath: string | undefined = body.storage_path;
    if (!storagePath) {
      return NextResponse.json({ error: 'storage_path is required' }, { status: 400 });
    }

    // Download the original from storage so the bytes pass through Vercel only
    // once (not in the request body — that has a 4.5 MB cap).
    const dl = await supabase.storage.from(BUCKET).download(storagePath);
    if (dl.error || !dl.data) {
      console.error('storage download failed:', dl.error);
      return NextResponse.json({ error: dl.error?.message || 'Original not found' }, { status: 404 });
    }
    const originalBuf = Buffer.from(await dl.data.arrayBuffer());

    // Validate MIME from actual bytes (sharp metadata).
    // EXIF auto-rotate before any resize so portrait phone photos display upright.
    const pipeline = sharp(originalBuf).rotate();
    const metadata = await pipeline.metadata();
    const fmt = metadata.format;
    const mimeFromFormat: Record<string, string> = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };
    const mime = fmt ? mimeFromFormat[fmt] : undefined;
    if (!mime || !ALLOWED_MIME.has(mime)) {
      // Clean up the orphan
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return NextResponse.json(
        { error: 'Unsupported image format. Use JPEG, PNG, or WebP.' },
        { status: 400 },
      );
    }
    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;
    if (!width || !height) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return NextResponse.json({ error: 'Could not read image dimensions' }, { status: 400 });
    }

    // Dup detection
    const contentHash = createHash('sha256').update(originalBuf).digest('hex');
    const dup = await supabase
      .from('photos')
      .select('id')
      .eq('content_hash', contentHash)
      .maybeSingle();
    if (dup.data) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return NextResponse.json(
        { error: 'This photo has already been uploaded.', existing_id: dup.data.id },
        { status: 409 },
      );
    }

    // Derived paths reuse the original UUID so all three sizes stay grouped.
    const baseName = storagePath.replace(/^originals\//, '').replace(/\.[^.]+$/, '');
    const thumbPath = `thumbs/${baseName}.webp`;
    const mediumPath = `medium/${baseName}.webp`;

    const thumbBuf = await sharp(originalBuf)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();

    const mediumBuf = await sharp(originalBuf)
      .rotate()
      .resize({ width: MEDIUM_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const thumbUp = await supabase.storage
      .from(BUCKET)
      .upload(thumbPath, thumbBuf, { contentType: 'image/webp', upsert: false });
    if (thumbUp.error) {
      console.error('thumb upload failed:', thumbUp.error);
      return NextResponse.json({ error: thumbUp.error.message }, { status: 500 });
    }
    const mediumUp = await supabase.storage
      .from(BUCKET)
      .upload(mediumPath, mediumBuf, { contentType: 'image/webp', upsert: false });
    if (mediumUp.error) {
      console.error('medium upload failed:', mediumUp.error);
      await supabase.storage.from(BUCKET).remove([thumbPath]);
      return NextResponse.json({ error: mediumUp.error.message }, { status: 500 });
    }

    // School year: prefer client-provided; else derive from date_taken or now.
    const dateTaken = body.date_taken ? new Date(body.date_taken) : new Date();
    let schoolYear: string = body.school_year || schoolYearFromDate(dateTaken);
    if (!isValidSchoolYear(schoolYear)) {
      schoolYear = schoolYearFromDate(dateTaken);
    }

    const insert = await supabase
      .from('photos')
      .insert({
        storage_path: storagePath,
        thumb_path: thumbPath,
        medium_path: mediumPath,
        width,
        height,
        mime_type: mime,
        file_size: originalBuf.length,
        caption: body.caption || null,
        alt_text: body.alt_text || null,
        date_taken: dateTaken.toISOString(),
        school_year: schoolYear,
        event_id: body.event_id ?? null,
        uploader_id: user.id,
        content_hash: contentHash,
        is_published: body.is_published ?? true,
      })
      .select('*, event:events(id, title, date)')
      .single();

    if (insert.error) {
      console.error('photos insert failed:', insert.error);
      // Best-effort orphan cleanup
      await supabase.storage.from(BUCKET).remove([storagePath, thumbPath, mediumPath]);
      return NextResponse.json({ error: insert.error.message }, { status: 500 });
    }

    return NextResponse.json(insert.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('photos POST error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
