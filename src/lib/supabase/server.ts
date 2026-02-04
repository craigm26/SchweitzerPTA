import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  // Get and trim environment variables (remove any whitespace/newlines)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'MISSING');
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'MISSING');
    throw new Error('Supabase environment variables are not configured. Please check your .env.local file.');
  }

  // Validate URL format
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.error('Invalid Supabase URL format:', supabaseUrl.substring(0, 30) + '...');
    throw new Error('Invalid Supabase URL format. Expected format: https://xxxxx.supabase.co');
  }

  // Validate key format - accept both legacy JWT format (eyJ...) and modern publishable format (sb_publishable_...)
  const isLegacyJWT = supabaseKey.startsWith('eyJ');
  const isModernPublishable = supabaseKey.startsWith('sb_publishable_');
  
  if (!isLegacyJWT && !isModernPublishable) {
    console.error('⚠️ Warning: API key format is unexpected');
    console.error('Expected format: "eyJ..." (legacy JWT) or "sb_publishable_..." (modern publishable key)');
    console.error('Make sure you are using the "anon public" or "publishable" key, not the "service_role" key');
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

