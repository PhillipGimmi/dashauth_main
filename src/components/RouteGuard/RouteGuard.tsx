'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/signin', '/signup'];
// Routes that are public (no auth required)
const publicRoutes = ['/reset-password', '/verify-email', '/'];

export function RouteGuard({ children }: { readonly children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip route check if still loading auth state
    if (loading) return;

    console.log('🛡️ Route guard check:', {
      path: pathname,
      isAuthenticated,
      loading,
    });

    // Skip checks for public routes
    if (publicRoutes.some((route) => pathname === route || pathname?.startsWith(route))) {
      return;
    }

    // Skip auth check for auth routes (signin/signup)
    if (authRoutes.includes(pathname ?? '')) {
      return;
    }

    // If on a protected route and not authenticated, redirect to signin
    if (
      protectedRoutes.some((route) => pathname === route || pathname?.startsWith(route)) &&
      !isAuthenticated
    ) {
      console.log('🚫 Access denied - redirecting to signin');
      router.replace('/signin');
      return;
    }

    // If on an auth route (signin/signup) and already authenticated, redirect to dashboard
    if (authRoutes.includes(pathname ?? '') && isAuthenticated) {
      console.log('✅ Already authenticated - redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  return <>{children}</>;
}

export default RouteGuard;
