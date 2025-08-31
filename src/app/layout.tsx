import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/components/language-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { BottomNavBar } from '@/components/bottom-nav-bar';

export const metadata: Metadata = {
  title: 'Interlude',
  description: 'Converts user-inputted links using the interlude.api.leshift.de/convert API.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex flex-1 justify-center py-8 pb-24 md:pb-8">
                <div className="container px-4">
                    {children}
                </div>
              </main>
              <BottomNavBar />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
