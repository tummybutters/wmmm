import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  const redirectTo = new URL('/login', request.url);
  return NextResponse.redirect(redirectTo);
}

