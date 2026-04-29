import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCanvas, DOMMatrix } from '@napi-rs/canvas';

// pdfjs-dist's Node legacy build needs a few browser-only globals to exist.
// @napi-rs/canvas provides a compatible DOMMatrix.
const g = globalThis as unknown as { DOMMatrix?: unknown };
if (!g.DOMMatrix) g.DOMMatrix = DOMMatrix;

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const THUMBNAIL_SCALE = 1.5;
const BUCKET = 'documents';

async function renderFirstPageToPng(pdfBuffer: ArrayBuffer): Promise<Buffer | null> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(pdfBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: THUMBNAIL_SCALE });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    await page.render({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvas: canvas as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      canvasContext: context as any,
      viewport,
    }).promise;
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('PDF thumbnail render failed:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 },
      );
    }

    const pdfBuffer = await file.arrayBuffer();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const timestamp = Date.now();
    const pdfPath = `event-flyers/${timestamp}-${safeName}`;

    const { error: pdfUploadError } = await supabase.storage
      .from(BUCKET)
      .upload(pdfPath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (pdfUploadError) {
      console.error('PDF upload failed:', pdfUploadError);
      return NextResponse.json({ error: pdfUploadError.message }, { status: 500 });
    }

    const { data: { publicUrl: pdf_url } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(pdfPath);

    // Best-effort thumbnail render. A failure here does not fail the request.
    const pngBuffer = await renderFirstPageToPng(pdfBuffer);
    let pdf_thumbnail_url: string | null = null;

    if (pngBuffer) {
      const thumbBaseName = safeName.replace(/\.pdf$/i, '') || 'flyer';
      const thumbPath = `event-flyers/${timestamp}-${thumbBaseName}-thumb.png`;
      const { error: thumbUploadError } = await supabase.storage
        .from(BUCKET)
        .upload(thumbPath, pngBuffer, {
          contentType: 'image/png',
          upsert: false,
        });

      if (thumbUploadError) {
        console.error('Thumbnail upload failed:', thumbUploadError);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(thumbPath);
        pdf_thumbnail_url = publicUrl;
      }
    }

    return NextResponse.json({
      pdf_url,
      pdf_filename: file.name,
      pdf_thumbnail_url,
    });
  } catch (error: unknown) {
    console.error('Error in event flyer upload:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
