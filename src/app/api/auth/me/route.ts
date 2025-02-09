import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getServiceRoleClient } from '@/app/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'your-secret-key');

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/me called');

    // Get the token from the cookie
    const token = request.cookies.get('authToken')?.value;
    console.log('🎟️ Auth token found:', token ? 'yes' : 'no');

    // If no token, return unauthenticated (this is a normal state)
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated',
      });
    }

    // Only try to initialize Supabase if we have a token
    const serviceRoleClient = getServiceRoleClient();
    if (!serviceRoleClient) {
      console.error(
        '❌ Failed to create Supabase service role client - check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars'
      );
      return NextResponse.json({
        authenticated: false,
        message: 'Configuration error',
      });
    }

    // Verify JWT token
    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (error) {
      console.log('ℹ️ JWT verification failed:', error);
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid token',
      });
    }

    // Get user from database
    const { data: user, error: userError } = await serviceRoleClient
      .from('users')
      .select('*')
      .eq('id', payload.sub)
      .single();

    if (userError) {
      console.log('ℹ️ User not found:', userError);
      return NextResponse.json({
        authenticated: false,
        message: 'User not found',
      });
    }

    // Verify session is still valid in database
    const { data: session, error: sessionError } = await serviceRoleClient
      .from('sessions')
      .select('id, expires_at')
      .eq('user_id', user.id)
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      console.log('ℹ️ Session invalid:', sessionError);
      return NextResponse.json({
        authenticated: false,
        message: 'Session expired',
      });
    }

    const userData = {
      authenticated: true,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      email_verified: user.email_verified,
      token: token,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('❌ Unexpected error in /api/auth/me:', error);
    return NextResponse.json({
      authenticated: false,
      message: 'Service unavailable',
    });
  }
}
