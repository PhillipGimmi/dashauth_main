'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useRef } from 'react';

// Auth routes where we don't need to check auth
const authRoutes = ['/signin', '/signup'];

export function AuthHydration() {
  const { setUser } = useAuthStore();
  const mounted = useRef(false);

  useEffect(() => {
    // Prevent double verification in development mode
    if (mounted.current) return;
    mounted.current = true;

    // Skip auth check on auth pages
    const pathname = window.location.pathname;
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      setUser(null);
      return;
    }

    async function verifySession() {
      console.log('🔄 Starting session verification...');

      try {
        console.log('📡 Fetching /api/auth/me...');
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        console.log('📨 /api/auth/me response:', {
          status: response.status,
          ok: response.ok,
        });

        const data = await response.json();

        if (response.ok && data.authenticated) {
          console.log('✅ Session valid, user data:', data);
          setUser(data);
        } else {
          console.log('ℹ️ Not authenticated:', data.message || 'No session');
          setUser(null);
        }
      } catch (error) {
        console.error('💥 Session verification failed:', error);
        setUser(null);
      }
    }

    verifySession();
  }, [setUser]);

  return null;
}

export default AuthHydration;
