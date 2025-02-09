'use client';

import { AuthXeroUser } from '@/app/types/auth';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: AuthXeroUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: AuthXeroUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          loading: false,
        }),

      setLoading: (loading) => set({ loading }),

      logout: async () => {
        try {
          // Call the logout endpoint to invalidate session and clear cookies
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });

          // Clear local state
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });

          // Redirect to home page
          window.location.href = '/';
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear local state even if API call fails
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
