import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type JsonRecord = Record<string, unknown>;

interface DashboardAnalyticsResponse {
  visitors: number | null;
  pageViews: number | null;
  bounceRate: number | null;
  topPage: string | null;
  source: 'vercel' | 'unavailable';
  note?: string;
  debug?: {
    hasAccessToken: boolean;
    projectId: string | null;
    teamId: string | null;
    teamIdLooksLikeSlug?: boolean;
    rangeDays: number;
    endpointPath: string;
    vercelStatus?: number;
  };
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function pickFirstNumber(obj: unknown, keys: string[]): number | null {
  if (!obj || typeof obj !== 'object') return null;

  const queue: unknown[] = [obj];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item);
      continue;
    }

    const record = current as JsonRecord;
    for (const key of keys) {
      const value = readNumber(record[key]);
      if (value !== null) return value;
    }

    for (const value of Object.values(record)) queue.push(value);
  }

  return null;
}

function pickTopPage(obj: unknown): string | null {
  if (!obj || typeof obj !== 'object') return null;

  const queue: unknown[] = [obj];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item);
      continue;
    }

    const record = current as JsonRecord;
    for (const key of ['topPages', 'pages', 'paths', 'routes']) {
      const maybeList = record[key];
      if (!Array.isArray(maybeList) || maybeList.length === 0) continue;
      const first = maybeList[0];
      if (!first || typeof first !== 'object') continue;
      const firstRecord = first as JsonRecord;
      const candidate = firstRecord.path ?? firstRecord.route ?? firstRecord.page ?? firstRecord.name;
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate;
      }
    }

    for (const value of Object.values(record)) queue.push(value);
  }

  return null;
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

function maskValue(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length <= 6) return value;
  return `${value.slice(0, 3)}...${value.slice(-3)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const debugRequested = searchParams.get('debug') === '1';
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    const baseResponse = defaultUnavailable('Missing VERCEL_ACCESS_TOKEN or VERCEL_PROJECT_ID environment variables.');
    if (debugRequested) {
      baseResponse.debug = {
        hasAccessToken: Boolean(token),
        projectId: maskValue(projectId),
        teamId: maskValue(teamId),
        teamIdLooksLikeSlug: Boolean(teamId && !teamId.startsWith('team_')),
        rangeDays: 30,
        endpointPath: '/v1/web/analytics',
      };
    }

    return NextResponse.json(baseResponse);
  }

  const to = Date.now();
  const from = to - 30 * 24 * 60 * 60 * 1000;
  const params = new URLSearchParams({
    projectId,
    from: from.toString(),
    to: to.toString(),
  });

  if (teamId) params.set('teamId', teamId);

  const endpoint = `https://api.vercel.com/v1/web/analytics?${params.toString()}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const details = await response.text();
      const baseResponse = defaultUnavailable(`Vercel API request failed: ${response.status} ${details}`);
      if (debugRequested) {
        baseResponse.debug = {
          hasAccessToken: true,
          projectId: maskValue(projectId),
          teamId: maskValue(teamId),
          teamIdLooksLikeSlug: Boolean(teamId && !teamId.startsWith('team_')),
          rangeDays: 30,
          endpointPath: '/v1/web/analytics',
          vercelStatus: response.status,
        };
      }

      return NextResponse.json(baseResponse);
    }

    const payload = (await response.json()) as unknown;
    const visitors = pickFirstNumber(payload, ['visitors', 'uniqueVisitors', 'visitorCount']);
    const pageViews = pickFirstNumber(payload, ['pageViews', 'views', 'pageviews']);
    const bounceRate = pickFirstNumber(payload, ['bounceRate', 'bounce_rate']);
    const topPage = pickTopPage(payload);

    const payloadResponse: DashboardAnalyticsResponse = {
      visitors,
      pageViews,
      bounceRate,
      topPage,
      source: 'vercel',
    };

    if (debugRequested) {
      payloadResponse.debug = {
        hasAccessToken: true,
        projectId: maskValue(projectId),
        teamId: maskValue(teamId),
        teamIdLooksLikeSlug: Boolean(teamId && !teamId.startsWith('team_')),
        rangeDays: 30,
        endpointPath: '/v1/web/analytics',
        vercelStatus: response.status,
      };
    }

    return NextResponse.json(payloadResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const baseResponse = defaultUnavailable(`Failed to fetch Vercel analytics: ${message}`);
    if (debugRequested) {
      baseResponse.debug = {
        hasAccessToken: Boolean(token),
        projectId: maskValue(projectId),
        teamId: maskValue(teamId),
        teamIdLooksLikeSlug: Boolean(teamId && !teamId.startsWith('team_')),
        rangeDays: 30,
        endpointPath: '/v1/web/analytics',
      };
    }

    return NextResponse.json(baseResponse);
  }
}
