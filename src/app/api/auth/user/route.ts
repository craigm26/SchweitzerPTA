import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ user: null });
  }

  // Get profile with role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: 'member',
      },
    });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: profile.full_name,
      role: profile.role,
      avatar_url: profile.avatar_url,
    },
  });
}

