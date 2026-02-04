import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Allowed file types by bucket
const ALLOWED_TYPES: Record<string, string[]> = {
  'sponsor-logos': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  'auction-item-photos': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  'documents': [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    // PDFs
    'application/pdf',
    // Office documents
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain',
  ],
};

// Max file sizes by bucket (in bytes)
const MAX_FILE_SIZES: Record<string, number> = {
  'sponsor-logos': 5 * 1024 * 1024,  // 5MB for logos
  'auction-item-photos': 10 * 1024 * 1024,  // 10MB for item photos
  'documents': 10 * 1024 * 1024,      // 10MB for documents
};

// Valid bucket names
const VALID_BUCKETS = ['sponsor-logos', 'auction-item-photos', 'documents'];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'sponsor-logos';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate bucket
    if (!VALID_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: 'Invalid storage bucket' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ALLOWED_TYPES[bucket];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }, { status: 400 });
    }

    // Validate file size
    const maxSize = MAX_FILE_SIZES[bucket];
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json({
        error: `File too large. Maximum size is ${maxSizeMB}MB`
      }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const { error } = await supabase
      .storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filename);

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error: unknown) {
    console.error('Error in upload API:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
