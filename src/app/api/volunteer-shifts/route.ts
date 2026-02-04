import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const eventIdParam = searchParams.get('eventId');

    let query = supabase.from('event_volunteer_shifts').select('*').order('start_time', { ascending: true });

    if (eventIdParam) {
      query = query.eq('event_id', Number(eventIdParam));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching volunteer shifts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error in volunteer shifts GET:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load volunteer shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('event_volunteer_shifts')
      .insert({
        event_id: body.event_id,
        job_title: body.job_title,
        shift_description: body.shift_description,
        start_time: body.start_time,
        end_time: body.end_time,
        spots_available: body.spots_available,
        spots_filled: body.spots_filled || 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating volunteer shift:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('event_volunteer_shifts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating volunteer shift:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('event_volunteer_shifts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting volunteer shift:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
