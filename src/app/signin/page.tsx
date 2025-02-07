import DarkGridAuth from '@/components/DarkGridAuth/DarkGridAuth';
import { Suspense } from 'react';

export const metadata = {
  title: 'Sign In - MyApp',
  description: 'Access your account or create a new one on MyApp.',
};
export default function SignInPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950">
      {/* Radial gradient overlay */}
      <div
        style={{
          backgroundImage: 'radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))',
        }}
        className="pointer-events-none absolute inset-0"
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
