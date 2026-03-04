import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DashboardAnalyticsResponse {
  visitors: number | null;
  pageViews: number | null;
  bounceRate: number | null;
  topPage: string | null;
  source: 'first_party' | 'vercel_import' | 'combined' | 'unavailable';
  note?: string;
  debug?: {
    eventsInWindow?: number;
    sessionsInWindow?: number;
    bounceSessions?: number;
    importedSnapshotVisitors?: number | null;
    importedSnapshotPageViews?: number | null;
    importedSnapshotBounceRate?: number | null;
    rangeDays: number;
    dataSource: string;
  };
}

function defaultUnavailable(note: string): DashboardAnalyticsResponse {
  return {
    visitors: null,
    pageViews: null,
    bounceRate: null,
    topPage: null,
    source: 'unavailable',
    note,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debugRequested = searchParams.get('debug') === '1';
  const rangeDays = 30;
  const windowStart = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString();
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

  const { data, error } = await supabase
    .from('analytics_pageviews')
    .select('path, visitor_id, session_id')
    .gte('occurred_at', windowStart);

  if (error) {
    return NextResponse.json(defaultUnavailable(`Failed to query analytics: ${error.message}`), { status: 500 });
  }

  const { data: snapshotRows, error: snapshotError } = await supabase
    .from('analytics_snapshots')
    .select('visitors, page_views, bounce_rate, top_page')
    .eq('period_days', rangeDays)
    .order('captured_at', { ascending: false })
    .limit(1);

  if (snapshotError) {
    return NextResponse.json(defaultUnavailable(`Failed to query analytics snapshots: ${snapshotError.message}`), {
      status: 500,
    });
  }

  const rows = data || [];
  const latestSnapshot = snapshotRows?.[0] || null;
  const pageViews = rows.length;
  const uniqueVisitors = new Set(rows.map((row) => row.visitor_id)).size;

  const sessionCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();

  for (const row of rows) {
    sessionCounts.set(row.session_id, (sessionCounts.get(row.session_id) || 0) + 1);
    pageCounts.set(row.path, (pageCounts.get(row.path) || 0) + 1);
  }

  let bounceSessions = 0;
  for (const count of sessionCounts.values()) {
    if (count === 1) bounceSessions += 1;
  }
  const totalSessions = sessionCounts.size;

  let topPage: string | null = null;
  let topPageViews = 0;
  for (const [path, count] of pageCounts.entries()) {
    if (count > topPageViews) {
      topPageViews = count;
      topPage = path;
    }
  }

  const firstPartyBounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : null;

  const hasFirstPartyData = pageViews > 0 || uniqueVisitors > 0;
  const hasImportedSnapshot = Boolean(latestSnapshot);

  const mergedVisitors = hasImportedSnapshot
    ? Math.max(uniqueVisitors, latestSnapshot?.visitors ?? 0)
    : uniqueVisitors;
  const mergedPageViews = hasImportedSnapshot
    ? Math.max(pageViews, latestSnapshot?.page_views ?? 0)
    : pageViews;
  const mergedBounceRate = hasImportedSnapshot
    ? (latestSnapshot?.bounce_rate as number | null)
    : firstPartyBounceRate;
  const mergedTopPage = topPage || latestSnapshot?.top_page || null;

  const response: DashboardAnalyticsResponse = {
    visitors: hasFirstPartyData || hasImportedSnapshot ? mergedVisitors : null,
    pageViews: hasFirstPartyData || hasImportedSnapshot ? mergedPageViews : null,
    bounceRate: hasFirstPartyData || hasImportedSnapshot ? mergedBounceRate : null,
    topPage: hasFirstPartyData || hasImportedSnapshot ? mergedTopPage : null,
    source: hasFirstPartyData && hasImportedSnapshot ? 'combined' : hasImportedSnapshot ? 'vercel_import' : hasFirstPartyData ? 'first_party' : 'unavailable',
    note:
      hasImportedSnapshot && hasFirstPartyData
        ? 'Using imported Vercel snapshot as baseline plus first-party tracking for newer activity.'
        : undefined,
  };

  if (debugRequested) {
    response.debug = {
      eventsInWindow: rows.length,
      sessionsInWindow: totalSessions,
      bounceSessions,
      importedSnapshotVisitors: latestSnapshot?.visitors ?? null,
      importedSnapshotPageViews: latestSnapshot?.page_views ?? null,
      importedSnapshotBounceRate: (latestSnapshot?.bounce_rate as number | null) ?? null,
      rangeDays,
      dataSource: hasImportedSnapshot
        ? 'public.analytics_pageviews + public.analytics_snapshots'
        : 'public.analytics_pageviews',
    };
  }

  return NextResponse.json(response);
}
