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
