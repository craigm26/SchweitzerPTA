import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidSchoolYear } from '@/lib/school-year';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EDITABLE = new Set([
  'caption',
  'alt_text',
  'date_taken',
  'school_year',
  'event_id',
  'is_published',
]);

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { ids?: number[]; patch?: Record<string, unknown> };
    const ids = Array.isArray(body.ids) ? body.ids.filter((n) => Number.isInteger(n)) : [];
    if (ids.length === 0) {
      return NextResponse.json({ error: 'ids[] required' }, { status: 400 });
    }
    if (ids.length > 500) {
      return NextResponse.json({ error: 'Batch too large (max 500)' }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body.patch || {})) {
      if (EDITABLE.has(key)) update[key] = value;
    }
    if (typeof update.school_year === 'string' && !isValidSchoolYear(update.school_year)) {
      return NextResponse.json({ error: 'Invalid school_year format (expect YYYY-YYYY).' }, { status: 400 });
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No editable fields in patch' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('photos')
      .update(update)
      .in('id', ids)
      .select('id');

    if (error) {
      console.error('photos batch PATCH failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ updated: data?.length ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('photos batch error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
