import * as React from 'react';
import { Suspense } from 'react';
import DarkGridAuth from '@/components/DarkGridAuth/DarkGridAuth';

export const metadata = {
  title: 'Sign In - MyApp',
  description: 'Access your account or create a new one on MyApp.',
};
export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950">
      {/* Radial gradient overlay - updated for dark mode */}
      <div
        style={{
          backgroundImage:
            'radial-gradient(100% 100% at 100% 0%, rgba(255,255,255,0), rgba(255,255,255,1))',
        }}
        className="pointer-events-none absolute inset-0 dark:[background-image:radial-gradient(100%_100%_at_100%_0%,rgba(9,9,11,0),rgba(9,9,11,1))]"
      />
      {/* Main content */}
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-zinc-400">Loading...</div>
          </div>
        }
      >
        <DarkGridAuth />
      </Suspense>
    </div>
  );
}
