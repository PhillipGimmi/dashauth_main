import { Noto_Sans_JP } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import RouteGuard from '@/components/RouteGuard/RouteGuard';
import AuthHydration from '@/components/auth/AuthHydration/AuthHydration';
import '@/styles/theme.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-noto-sans-jp',
});

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={notoSansJP.variable}>
      <body className="h-screen overflow-y-auto bg-black dark:bg-white">
        <div className="min-h-full">
          <ThemeProvider>
            <AuthHydration />
            <ThemeToggle />
            <RouteGuard>{children}</RouteGuard>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
