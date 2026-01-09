import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Default logo to use when no logo is provided
const DEFAULT_LOGO = '/AlbertSchweitzerElementaryLogo.png';

// Try to fetch a favicon/logo from a website
async function fetchWebsiteLogo(websiteUrl: string): Promise<string | null> {
  if (!websiteUrl) return null;

  try {
    // Normalize URL
    let url = websiteUrl;
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // Try common favicon services (these provide reliable favicon URLs)
    const faviconServices = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icon.horse/icon/${domain}`,
      `https://logo.clearbit.com/${domain}`,
    ];

    // Try each service until one works
    for (const faviconUrl of faviconServices) {
      try {
        const response = await fetch(faviconUrl, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          // For Google favicons, check if it's not a default/empty icon
          if (faviconUrl.includes('google.com')) {
            return faviconUrl;
          }
          // For others, verify content type is an image
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            return faviconUrl;
          }
        }
      } catch {
        // Try next service
        continue;
      }
    }
  } catch (error) {
    console.error('Error fetching website logo:', error);
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('donors')
      .select('*', { count: 'exact' });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    query = query
      .order('name', { ascending: true })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching donors:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    });
  } catch (error: any) {
    console.error('Error in donors API route:', error);
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

    // Determine logo: use provided, fetch from website, or use default
    let logo = body.logo;
    if (!logo && body.website) {
      // Try to fetch logo from website
      logo = await fetchWebsiteLogo(body.website);
    }
    if (!logo) {
      // Fall back to default logo
      logo = DEFAULT_LOGO;
    }

    const { data, error } = await supabase
      .from('donors')
      .insert({
        name: body.name,
        website: body.website,
        logo: logo,
        description: body.description,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating donor:', error);
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
      .from('donors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating donor:', error);
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
    .from('donors')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting donor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
