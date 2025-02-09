import { Noto_Sans_JP } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggleWrapper from '@/components/ThemeToggle/ThemeToggleWrapper';
import RouteGuard from '@/components/RouteGuard/RouteGuard';
import AuthHydration from '@/components/auth/AuthHydration/AuthHydration';
import '@/styles/theme.css';
import AnimatedBackground from '@/components/MainAnimatedBackground/AnimatedBackground';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-noto-sans-jp',
});

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" className={notoSansJP.variable} suppressHydrationWarning>
      <body className="h-screen overflow-y-auto">
        <div className="min-h-full">
          <ThemeProvider>
            <AnimatedBackground />
            <AuthHydration />
            <ThemeToggleWrapper />
            <RouteGuard>{children}</RouteGuard>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
