import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Get and trim environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  
  // Validate key format - accept both legacy JWT and modern publishable formats
  const keyFormatValid = supabaseKey?.startsWith('eyJ') || supabaseKey?.startsWith('sb_publishable_') || false;
  const urlFormatValid = supabaseUrl?.startsWith('https://') && supabaseUrl?.includes('.supabase.co') || false;
  
  return NextResponse.json({
    supabaseUrl: supabaseUrl 
      ? `${supabaseUrl.substring(0, 20)}...${supabaseUrl.substring(supabaseUrl.length - 10)}` 
      : 'NOT SET',
    supabaseUrlLength: supabaseUrl?.length || 0,
    supabaseUrlFormatValid: urlFormatValid,
    supabaseKeySet: supabaseKey ? 'Set' : 'NOT SET',
    supabaseKeyLength: supabaseKey?.length || 0,
    supabaseKeyFormatValid: keyFormatValid,
    supabaseKeyPrefix: supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'N/A',
    expectedUrl: 'https://mrptpsbzadthudiiazqr.supabase.co',
    actualUrl: supabaseUrl || 'NOT SET',
    urlMatches: supabaseUrl === 'https://mrptpsbzadthudiiazqr.supabase.co',
    hasWhitespace: supabaseUrl !== process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseKey !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    diagnostics: {
      urlPresent: !!supabaseUrl,
      keyPresent: !!supabaseKey,
      urlValid: urlFormatValid,
      keyValid: keyFormatValid,
      allValid: urlFormatValid && keyFormatValid && !!supabaseUrl && !!supabaseKey
    }
  });
}

