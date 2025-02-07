'use client';

import Dashboard from '@/components/group/Dashboard/dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <Dashboard />
    </ErrorBoundary>
  );
}
