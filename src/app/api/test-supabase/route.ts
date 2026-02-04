import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    // Check for hidden characters
    const keyBytes = supabaseKey ? new TextEncoder().encode(supabaseKey) : null;
    const hasNonAscii = keyBytes ? keyBytes.some(b => b > 127) : false;
    const keyCharCodes = supabaseKey ? Array.from(supabaseKey.substring(0, 50)).map(c => c.charCodeAt(0)) : [];

    // Decode JWT to see what's in it (first two parts are base64 encoded JSON)
    let jwtInfo = null;
    if (supabaseKey?.startsWith('eyJ')) {
      try {
        const parts = supabaseKey.split('.');
        if (parts.length >= 2) {
          const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          jwtInfo = {
            header,
            payload: {
              iss: payload.iss,
              ref: payload.ref,
              role: payload.role,
              // Don't log sensitive info
            },
            expectedRef: 'mrptpsbzadthudiiazqr',
            refMatches: payload.ref === 'mrptpsbzadthudiiazqr'
          };
        }
      } catch (e) {
        jwtInfo = { error: 'Could not decode JWT', details: String(e) };
      }
    }

    // Try to make a simple Supabase call
    const supabase = await createClient();
    
    // Try a simple query that doesn't require RLS
    const { data, error } = await supabase
      .from('donors')
      .select('id')
      .limit(1);

    return NextResponse.json({
      success: !error,
      error: error ? {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      } : null,
      keyInfo: {
        length: supabaseKey?.length || 0,
        prefix: supabaseKey?.substring(0, 30) + '...',
        startsWithEyJ: supabaseKey?.startsWith('eyJ'),
        hasNonAsciiChars: hasNonAscii,
        first50CharCodes: keyCharCodes,
        jwtInfo
      },
      url: supabaseUrl,
      testQuery: data ? 'Success - query returned data' : 'No data returned'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
}
