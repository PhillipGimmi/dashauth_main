import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const preferredRegion = ['iad1'];

const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.NODE_ENV === 'production'
      ? 'https://dashauth-phillipgimmis-projects.vercel.app'
      : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, Accept, X-Refresh-Token, X-Request-ID',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type, X-Request-ID',
  'Access-Control-Max-Age': '86400',
};

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'off',
  'Permissions-Policy': [
    'accelerometer=()',
    'autoplay=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'encrypted-media=()',
    'fullscreen=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-get=()',
    'screen-wake-lock=()',
    'sync-xhr=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()',
  ].join(', '),
};

function addHeaders(response: NextResponse, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
}

export async function middleware(request: NextRequest) {
  // Skip middleware for WebSocket connections
  if (request.headers.get('upgrade') === 'websocket') {
    return NextResponse.next();
  }

  // For dashboard routes, check if user has active application
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🛡️ Checking dashboard access...');

    // Check auth using your API with full URL
    const baseUrl = request.nextUrl.origin;
    const authResponse = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
    });

    if (!authResponse.ok) {
      console.log('❌ No valid session found');
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const userData = await authResponse.json();
    console.log('👤 User ID:', userData.id);

    // Check for active application using your custom API
    const appResponse = await fetch(`${baseUrl}/api/applications/active`, {
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
    });

    if (!appResponse.ok) {
      console.log('⚠️ No active application found - redirecting to setup');
      return NextResponse.redirect(new URL('/setup-wizard', request.url));
    }

    console.log('✅ Active application found - allowing access');
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const requestId = request.headers.get('X-Request-ID') ?? crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        ...securityHeaders,
        'X-Request-ID': requestId,
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set('X-Request-ID', requestId);
  addHeaders(response, securityHeaders);

  if (pathname.startsWith('/api/')) {
    addHeaders(response, corsHeaders);
  }

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
