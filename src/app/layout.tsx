import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/components/app-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Header } from '@/components/header';
import { BottomNavbar } from '@/components/bottom-navbar';

export const metadata: Metadata = {
  title: 'Signal',
  description: 'Find and request the closest mechanics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" type="image/png" href="/favicon.ico/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/png" href="/favicon.ico/android-chrome-192x192.png" sizes="192x192" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Signal" />
        <link rel="manifest" href="/favicon.ico/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic antialiased">
        <FirebaseClientProvider>
          <AppProvider>
            <div className="flex min-h-screen w-full flex-col">
              <Header />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNavbar />
            </div>
            <Toaster />
          </AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
