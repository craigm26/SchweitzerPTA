import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const BUCKET = 'event-photos';
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const HEIC_MIME = new Set(['image/heic', 'image/heif']);

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { mime_type?: string; size?: number };
    const mime = (body.mime_type || '').toLowerCase();
    const size = Number(body.size || 0);

    if (HEIC_MIME.has(mime)) {
      return NextResponse.json(
        { error: 'HEIC/HEIF photos are not supported. Please convert to JPEG before uploading.' },
        { status: 400 },
      );
    }
    if (!ALLOWED_MIME.has(mime)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 },
      );
    }
    if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.` },
        { status: 400 },
      );
    }

    const ext = EXT_BY_MIME[mime];
    const path = `originals/${randomUUID()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('createSignedUploadUrl failed:', error);
      return NextResponse.json(
        { error: error?.message || 'Could not create upload URL' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      storage_path: path,
      token: data.token,
      signed_url: data.signedUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('upload-url error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
