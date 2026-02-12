import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
