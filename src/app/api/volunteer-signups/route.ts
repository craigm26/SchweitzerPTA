import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

  try {
    const body = await request.json();

    if (!body.shift_id || !body.name || !body.email) {
      return NextResponse.json({ error: 'shift_id, name, and email are required' }, { status: 400 });
    }

    const allowOverbook = body.allow_overbook === true;

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

    if (!allowOverbook && shift.spots_filled >= shift.spots_available) {
      return NextResponse.json({ error: 'No spots available' }, { status: 400 });
    }

    const { data: signup, error } = await supabase
      .from('event_volunteer_signups')
      .insert({
        shift_id: body.shift_id,
        user_id: null,
        name: body.name,
        email: body.email,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin signup:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { count, error: countError } = await supabase
      .from('event_volunteer_signups')
      .select('*', { count: 'exact', head: true })
      .eq('shift_id', body.shift_id)
      .neq('status', 'cancelled');

    if (countError) {
      console.error('Error counting signups:', countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const updatedCount = count || 0;

    const { error: updateError } = await supabase
      .from('event_volunteer_shifts')
      .update({ spots_filled: updatedCount })
      .eq('id', body.shift_id);

    if (updateError) {
      console.error('Error updating shift counts:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ signup, spots_filled: updatedCount });
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data: signup, error } = await supabase
      .from('event_volunteer_signups')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error || !signup) {
      console.error('Error updating signup:', error);
      return NextResponse.json({ error: error?.message || 'Signup not found' }, { status: 500 });
    }

    const { count, error: countError } = await supabase
      .from('event_volunteer_signups')
      .select('*', { count: 'exact', head: true })
      .eq('shift_id', signup.shift_id)
      .neq('status', 'cancelled');

    if (countError) {
      console.error('Error counting signups:', countError);
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const updatedCount = count || 0;

    const { error: updateError } = await supabase
      .from('event_volunteer_shifts')
      .update({ spots_filled: updatedCount })
      .eq('id', signup.shift_id);

    if (updateError) {
      console.error('Error updating shift counts:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ signup, spots_filled: updatedCount });
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
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

  const { searchParams } = new URL(request.url);
  const signupId = searchParams.get('id');

  if (!signupId) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const { data: signup, error: fetchError } = await supabase
    .from('event_volunteer_signups')
    .select('shift_id')
    .eq('id', signupId)
    .single();

  if (fetchError || !signup) {
    return NextResponse.json({ error: 'Signup not found' }, { status: 404 });
  }

  const { error } = await supabase
    .from('event_volunteer_signups')
    .delete()
    .eq('id', signupId);

  if (error) {
    console.error('Error deleting signup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count, error: countError } = await supabase
    .from('event_volunteer_signups')
    .select('*', { count: 'exact', head: true })
    .eq('shift_id', signup.shift_id)
    .neq('status', 'cancelled');

  if (countError) {
    console.error('Error counting signups:', countError);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const updatedCount = count || 0;

  const { error: updateError } = await supabase
    .from('event_volunteer_shifts')
    .update({ spots_filled: updatedCount })
    .eq('id', signup.shift_id);

  if (updateError) {
    console.error('Error updating shift counts:', updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, shift_id: signup.shift_id, spots_filled: updatedCount });
}
