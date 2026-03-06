import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVolunteerSignupAcknowledgement } from '@/lib/email';

function parseTimeParts(time: string | null): { hour: number; minute: number } | null {
  if (!time) return null;
  const match = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

  return { hour, minute };
}

function formatTimeLabel(time: string | null): string | null {
  const parts = parseTimeParts(time);
  if (!parts) return null;
  const period = parts.hour >= 12 ? 'PM' : 'AM';
  const hour12 = parts.hour % 12 || 12;
  return `${hour12}:${parts.minute.toString().padStart(2, '0')} ${period}`;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (body.shift_id) {
      // Event volunteer shift signup
      const { data: shift, error: shiftError } = await supabase
        .from('event_volunteer_shifts')
        .select('event_id, job_title, start_time, end_time, spots_available, spots_filled, is_active')
        .eq('id', body.shift_id)
        .single();

      if (shiftError || !shift) {
        return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
      }

      if (!shift.is_active) {
        return NextResponse.json({ error: 'Shift is not active' }, { status: 400 });
      }

      if (shift.spots_filled >= shift.spots_available) {
        return NextResponse.json({ error: 'No spots available' }, { status: 400 });
      }

      const { error } = await supabase
        .from('event_volunteer_signups')
        .insert({
          shift_id: body.shift_id,
          user_id: user?.id || null,
          name: body.name,
          email: body.email,
          status: 'pending',
        });

      if (error) {
        console.error('Error creating event signup:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { count, error: countError } = await supabase
        .from('event_volunteer_signups')
        .select('*', { count: 'exact', head: true })
        .eq('shift_id', body.shift_id)
        .neq('status', 'cancelled');

      if (countError) {
        console.error('Error counting event signups:', countError);
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }

      const updatedCount = count || 0;

      await supabase
        .from('event_volunteer_shifts')
        .update({ spots_filled: updatedCount })
        .eq('id', body.shift_id);

      const { data: event } = await supabase
        .from('events')
        .select('title, date, location')
        .eq('id', shift.event_id)
        .single();

      const shiftTimeLabel =
        shift.start_time || shift.end_time
          ? `${formatTimeLabel(shift.start_time) || 'Time TBD'}${shift.end_time ? ` - ${formatTimeLabel(shift.end_time) || 'Time TBD'}` : ''}`
          : 'Time flexible';

      let emailSent = false;
      try {
        if (event) {
          await sendVolunteerSignupAcknowledgement({
            volunteerEmail: body.email,
            volunteerName: body.name,
            eventTitle: event.title,
            eventDate: event.date,
            eventLocation: event.location,
            shiftTitle: shift.job_title,
            shiftTimeLabel,
          });
          emailSent = true;
        }
      } catch (emailError) {
        console.error('Volunteer acknowledgement email failed:', emailError);
      }

      return NextResponse.json({
        success: true,
        shift_id: body.shift_id,
        spots_filled: updatedCount,
        emailSent,
        eventTitle: event?.title || null,
        shiftTitle: shift.job_title,
        shiftTimeLabel,
      });
    }

    if (!body.opportunity_id) {
      return NextResponse.json({ error: 'Shift ID is required' }, { status: 400 });
    }

    // Legacy volunteer opportunity signup
    const { data: opportunity, error: oppError } = await supabase
      .from('volunteer_opportunities')
      .select('spots_available, spots_filled')
      .eq('id', body.opportunity_id)
      .single();

    if (oppError || !opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    if (opportunity.spots_filled >= opportunity.spots_available) {
      return NextResponse.json({ error: 'No spots available' }, { status: 400 });
    }

    const { error } = await supabase
      .from('volunteer_signups')
      .insert({
        opportunity_id: body.opportunity_id,
        user_id: user?.id || null,
        name: body.name,
        email: body.email,
        phone: body.phone,
        notes: body.notes,
        status: 'pending',
      });

    if (error) {
      console.error('Error creating signup:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from('volunteer_opportunities')
      .update({ spots_filled: opportunity.spots_filled + 1 })
      .eq('id', body.opportunity_id);

    return NextResponse.json({ success: true, opportunity_id: body.opportunity_id });
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

