import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/photos/reorder
// Body: { ordered_ids: number[] }
// Assigns display_order = 0..N-1 in the given order. Use it after a drag-drop
// reorder; the caller decides which set of photos to include (typically the
// admin's currently-filtered event group).
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { ordered_ids?: unknown };
    const ids = Array.isArray(body.ordered_ids)
      ? body.ordered_ids.filter((n): n is number => Number.isInteger(n))
      : [];
    if (ids.length === 0) {
      return NextResponse.json({ error: 'ordered_ids[] required' }, { status: 400 });
    }
    if (ids.length > 500) {
      return NextResponse.json({ error: 'Reorder batch too large (max 500)' }, { status: 400 });
    }

    // Per-row update — Supabase doesn't expose a multi-row UPDATE with
    // different values per id, and a CASE WHEN statement would need raw SQL.
    // 500-row cap keeps the round-trip count bounded.
    const results = await Promise.all(
      ids.map((id, index) =>
        supabase.from('photos').update({ display_order: index }).eq('id', id),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      console.error('photos reorder failed:', failed.error);
      return NextResponse.json({ error: failed.error.message }, { status: 500 });
    }

    return NextResponse.json({ updated: ids.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('photos reorder error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
