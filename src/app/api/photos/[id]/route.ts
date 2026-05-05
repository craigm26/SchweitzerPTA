import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidSchoolYear } from '@/lib/school-year';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'event-photos';

const EDITABLE = new Set([
  'caption',
  'alt_text',
  'date_taken',
  'school_year',
  'event_id',
  'is_published',
]);

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const update: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (EDITABLE.has(key)) update[key] = value;
    }
    if (typeof update.school_year === 'string' && !isValidSchoolYear(update.school_year)) {
      return NextResponse.json({ error: 'Invalid school_year format (expect YYYY-YYYY).' }, { status: 400 });
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No editable fields supplied' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('photos')
      .update(update)
      .eq('id', Number(id))
      .select('*, event:events(id, title, date)')
      .single();

    if (error) {
      console.error('photos PUT failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('photos PUT error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Look up storage paths first so we can clean up after the row is gone.
  const { data: row, error: fetchErr } = await supabase
    .from('photos')
    .select('storage_path, thumb_path, medium_path')
    .eq('id', Number(id))
    .single();

  if (fetchErr || !row) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  }

  // Storage first, then row. If storage fails we still try to delete the row
  // so the gallery doesn't show a broken image; we log the orphan for cleanup.
  const paths = [row.storage_path, row.thumb_path, row.medium_path];
  const removeRes = await supabase.storage.from(BUCKET).remove(paths);
  if (removeRes.error) {
    console.error('photos DELETE storage cleanup failed:', removeRes.error, paths);
  }

  const { error: rowErr } = await supabase.from('photos').delete().eq('id', Number(id));
  if (rowErr) {
    console.error('photos DELETE row failed:', rowErr);
    return NextResponse.json({ error: rowErr.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
