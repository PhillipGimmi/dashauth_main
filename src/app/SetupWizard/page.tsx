import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { jwtVerify } from 'jose';
import SetupWizard from '@/components/SetupWizard/SetupWizard';

export const metadata: Metadata = {
  title: 'Setup Wizard - DashAuth',
  description: 'Complete your DashAuth setup',
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'your-secret-key');

export default async function SetupWizardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    redirect('/signin');
  }

  try {
    // Verify the JWT token
    await jwtVerify(token, JWT_SECRET);
  } catch (error) {
    console.error('Invalid token:', error);
    redirect('/signin');
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <SetupWizard />
      </div>
    </main>
  );
}
