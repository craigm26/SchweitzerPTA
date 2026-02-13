import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const upcoming = searchParams.get('upcoming');
    const includeInactive = searchParams.get('includeInactive');

    let query = supabase
      .from('fundraiser_events')
      .select('*')
      .order('display_order', { ascending: true })
      .order('date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (upcoming === 'true') {
      query = query.gte('date', new Date().toISOString().split('T')[0]);
    }

    if (includeInactive !== 'true') {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching fundraisers:', error);
      return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in fundraisers API route:', error);
    return NextResponse.json({
      error: error.message || 'Failed to connect to Supabase',
      details: error.cause?.message || error.stack
    }, { status: 500 });
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
      .from('fundraiser_events')
      .insert({
        title: body.title,
        description: body.description,
        date: body.date || null,
        end_date: body.end_date || null,
        time: body.time || null,
        end_time: body.end_time || null,
        location: body.location || null,
        image: body.image,
        website_url: body.website_url || null,
        display_order: body.display_order ?? 0,
        is_featured: body.is_featured || false,
        is_all_day: body.is_all_day || false,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating fundraiser:', error);
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
      .from('fundraiser_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating fundraiser:', error);
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
    .from('fundraiser_events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting fundraiser:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
