import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['admin', 'editor'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get('format') === 'csv') {
    const header = 'email,source,created_at';
    const rows = (data || []).map((row) =>
      [toCsvValue(row.email), toCsvValue(row.source || ''), toCsvValue(row.created_at)].join(',')
    );
    const csv = [header, ...rows].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="newsletter-subscribers.csv"`,
      },
    });
  }

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === 'string' ? body.email : '';
    const email = rawEmail.trim().toLowerCase();
    const source = typeof body?.source === 'string' ? body.source.trim() : 'home_page';

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email,
        source: source || 'home_page',
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      console.error('Error creating newsletter subscription:', error);
      return NextResponse.json({ error: 'Unable to save your subscription right now.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error parsing newsletter subscription request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
