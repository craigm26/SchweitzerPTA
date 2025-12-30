import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if opportunity exists and has spots
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

    // Create signup
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

    // Increment spots_filled
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

