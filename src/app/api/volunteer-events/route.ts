import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const includeInactiveShifts = searchParams.get('includeInactiveShifts') === 'true';
    const includeSignups = searchParams.get('includeSignups') === 'true';
    const upcoming = searchParams.get('upcoming') !== 'false';
    const eventIdParam = searchParams.get('eventId');
    let allowInactive = false;
    let allowInactiveShifts = false;
    let allowSignups = false;

    if (includeInactive || includeInactiveShifts || includeSignups) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        allowInactive = profile?.role === 'admin' || profile?.role === 'editor';
        allowInactiveShifts = allowInactive;
        allowSignups = allowInactive;
      }
    }

    let eventsQuery = supabase.from('events').select('*').order('date', { ascending: true });

    if (!(includeInactive && allowInactive)) {
      eventsQuery = eventsQuery.eq('volunteer_active', true);
    }

    if (upcoming) {
      eventsQuery = eventsQuery.gte('date', new Date().toISOString().split('T')[0]);
    }

    if (eventIdParam) {
      eventsQuery = eventsQuery.eq('id', Number(eventIdParam));
    }

    const { data: events, error: eventsError } = await eventsQuery;

    if (eventsError) {
      console.error('Error fetching volunteer events:', eventsError);
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    if (!events || events.length === 0) {
      return NextResponse.json([]);
    }

    const eventIds = events.map((event) => event.id);
    let shiftsQuery = supabase
      .from('event_volunteer_shifts')
      .select('*')
      .in('event_id', eventIds)
      .order('start_time', { ascending: true })
      .order('id', { ascending: true });

    if (!(includeInactiveShifts && allowInactiveShifts)) {
      shiftsQuery = shiftsQuery.eq('is_active', true);
    }

    const { data: shifts, error: shiftsError } = await shiftsQuery;

    if (shiftsError) {
      console.error('Error fetching volunteer shifts:', shiftsError);
      return NextResponse.json({ error: shiftsError.message }, { status: 500 });
    }

    let signupsByShift = new Map<number, any[]>();
    if (includeSignups && allowSignups && shifts && shifts.length > 0) {
      const shiftIds = shifts.map((shift) => shift.id);
      const { data: signups, error: signupsError } = await supabase
        .from('event_volunteer_signups')
        .select('*')
        .in('shift_id', shiftIds)
        .order('created_at', { ascending: false });

      if (signupsError) {
        console.error('Error fetching volunteer signups:', signupsError);
      } else {
        signupsByShift = new Map<number, any[]>();
        (signups || []).forEach((signup) => {
          if (!signupsByShift.has(signup.shift_id)) {
            signupsByShift.set(signup.shift_id, []);
          }
          signupsByShift.get(signup.shift_id)?.push(signup);
        });
      }
    }

    const shiftsByEvent = new Map<number, typeof shifts>();
    (shifts || []).forEach((shift) => {
      const decoratedShift = signupsByShift.size
        ? { ...shift, signups: signupsByShift.get(shift.id) || [] }
        : shift;
      if (!shiftsByEvent.has(shift.event_id)) {
        shiftsByEvent.set(shift.event_id, []);
      }
      shiftsByEvent.get(shift.event_id)?.push(decoratedShift);
    });

    const response = events.map((event) => ({
      ...event,
      shifts: shiftsByEvent.get(event.id) || [],
    }));

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in volunteer events API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load volunteer events' },
      { status: 500 }
    );
  }
}
