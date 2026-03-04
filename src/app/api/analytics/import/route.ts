import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ImportSnapshotPayload {
  periodDays?: number;
  visitors?: number;
  pageViews?: number;
  bounceRate?: number | null;
  topPage?: string | null;
  source?: string;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let payload: ImportSnapshotPayload;
  try {
    payload = (await request.json()) as ImportSnapshotPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const periodDays = payload.periodDays ?? 30;
  const visitorsInput = payload.visitors ?? null;
  const pageViewsInput = payload.pageViews ?? null;
  const bounceRate = payload.bounceRate ?? null;
  const topPage = payload.topPage ?? null;
  const source = payload.source?.trim() || 'vercel_import';

  if (!Number.isInteger(periodDays) || periodDays <= 0 || periodDays > 365) {
    return NextResponse.json({ error: 'periodDays must be an integer between 1 and 365' }, { status: 400 });
  }
  if (typeof visitorsInput !== 'number' || !Number.isInteger(visitorsInput) || visitorsInput < 0) {
    return NextResponse.json({ error: 'visitors must be a non-negative integer' }, { status: 400 });
  }
  if (typeof pageViewsInput !== 'number' || !Number.isInteger(pageViewsInput) || pageViewsInput < 0) {
    return NextResponse.json({ error: 'pageViews must be a non-negative integer' }, { status: 400 });
  }
  if (bounceRate !== null && (typeof bounceRate !== 'number' || bounceRate < 0 || bounceRate > 100)) {
    return NextResponse.json({ error: 'bounceRate must be null or a number between 0 and 100' }, { status: 400 });
  }

  const visitors = visitorsInput as number;
  const pageViews = pageViewsInput as number;

  const { error } = await supabase.from('analytics_snapshots').insert({
    source,
    period_days: periodDays,
    visitors,
    page_views: pageViews,
    bounce_rate: bounceRate,
    top_page: topPage,
    metadata: {
      importedBy: user.id,
      importedAt: new Date().toISOString(),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
