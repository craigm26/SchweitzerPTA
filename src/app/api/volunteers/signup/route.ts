import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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
        .select('spots_available, spots_filled, is_active')
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

      const { data, error } = await supabase
        .from('event_volunteer_signups')
        .insert({
          shift_id: body.shift_id,
          user_id: user?.id || null,
          name: body.name,
          email: body.email,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event signup:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      await supabase
        .from('event_volunteer_shifts')
        .update({ spots_filled: shift.spots_filled + 1 })
        .eq('id', body.shift_id);

      return NextResponse.json(data);
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

    const { data, error } = await supabase
      .from('volunteer_signups')
      .insert({
        opportunity_id: body.opportunity_id,
        user_id: user?.id || null,
        name: body.name,
        email: body.email,
        phone: body.phone,
        notes: body.notes,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating signup:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from('volunteer_opportunities')
      .update({ spots_filled: opportunity.spots_filled + 1 })
      .eq('id', body.opportunity_id);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

