import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VALID_ITEM_TYPES = ['live', 'silent'] as const;

function normalizeItemType(value: unknown) {
  if (typeof value !== 'string') return 'silent';
  return (VALID_ITEM_TYPES as readonly string[]).includes(value) ? value : 'silent';
}

function normalizeImageUrls(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((url) => typeof url === 'string' && url.trim().length > 0);
  }
  return [];
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const itemType = searchParams.get('itemType') || searchParams.get('type');
    const donorId = searchParams.get('donorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limitParam = searchParams.get('limit');
    const limit = limitParam === 'all' ? 1000 : parseInt(limitParam || '100');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('auction_items')
      .select('*, donor:donors(id,name,website,logo)', { count: 'exact' });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    if (itemType && VALID_ITEM_TYPES.includes(itemType as (typeof VALID_ITEM_TYPES)[number])) {
      query = query.eq('item_type', itemType);
    }

    if (donorId) {
      query = query.eq('donor_id', donorId);
    }

    query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching auction items:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    });
  } catch (error) {
    console.error('Error in auction items GET:', error);
    return NextResponse.json({ error: 'Failed to fetch auction items' }, { status: 500 });
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

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('auction_items')
      .insert({
        donor_id: body.donor_id || null,
        title: body.title,
        description: body.description,
        item_type: normalizeItemType(body.item_type),
        image_urls: normalizeImageUrls(body.image_urls),
        estimated_value: body.estimated_value ?? null,
        restrictions: body.restrictions ?? null,
        quantity: body.quantity ?? null,
        display_order: body.display_order ?? 0,
        is_active: body.is_active ?? true,
      })
      .select('*, donor:donors(id,name,website,logo)')
      .single();

    if (error) {
      console.error('Error creating auction item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating auction item:', error);
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

    const updatePayload = {
      ...updateData,
      item_type: updateData.item_type ? normalizeItemType(updateData.item_type) : undefined,
      image_urls: updateData.image_urls ? normalizeImageUrls(updateData.image_urls) : undefined,
    };

    const { data, error } = await supabase
      .from('auction_items')
      .update(updatePayload)
      .eq('id', id)
      .select('*, donor:donors(id,name,website,logo)')
      .single();

    if (error) {
      console.error('Error updating auction item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating auction item:', error);
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
    .from('auction_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting auction item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
