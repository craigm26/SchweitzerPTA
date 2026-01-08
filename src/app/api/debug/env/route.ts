import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Only show partial URL for security (first 10 chars)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    supabaseUrl: supabaseUrl 
      ? `${supabaseUrl.substring(0, 20)}...${supabaseUrl.substring(supabaseUrl.length - 10)}` 
      : 'NOT SET',
    supabaseUrlLength: supabaseUrl?.length || 0,
    supabaseKeySet: supabaseKey ? 'Set' : 'NOT SET',
    supabaseKeyLength: supabaseKey?.length || 0,
    expectedUrl: 'https://mrptpsbzadthudiiazqr.supabase.co',
    actualUrl: supabaseUrl || 'NOT SET',
    matches: supabaseUrl === 'https://mrptpsbzadthudiiazqr.supabase.co',
  });
}

