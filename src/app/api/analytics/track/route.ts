import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface TrackPayload {
  path?: string;
  referrer?: string | null;
  visitorId?: string;
  sessionId?: string;
}

function inferDeviceType(userAgent: string | null) {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return 'bot';
  if (ua.includes('ipad') || ua.includes('tablet')) return 'tablet';
  if (ua.includes('mobi') || ua.includes('android')) return 'mobile';
  return 'desktop';
}

export async function POST(request: Request) {
  const supabase = await createClient();

  let payload: TrackPayload;
  try {
    payload = (await request.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const path = payload.path?.trim();
  const visitorId = payload.visitorId?.trim();
  const sessionId = payload.sessionId?.trim();

  if (!path || !path.startsWith('/') || path.length > 2048) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  if (!visitorId || !sessionId) {
    return NextResponse.json({ error: 'Missing visitorId or sessionId' }, { status: 400 });
  }

  const userAgent = request.headers.get('user-agent');
  const country = request.headers.get('x-vercel-ip-country');
  const referrer = payload.referrer || request.headers.get('referer');

  const { error } = await supabase.from('analytics_pageviews').insert({
    path,
    referrer: referrer || null,
    visitor_id: visitorId,
    session_id: sessionId,
    user_agent: userAgent,
    country: country || null,
    device_type: inferDeviceType(userAgent),
    metadata: {
      host: request.headers.get('host'),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
