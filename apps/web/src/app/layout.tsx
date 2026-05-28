import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Mardo Café - Artisan Coffee & Homemade Desserts',
  description: 'Your cozy corner for artisan coffee, homemade desserts, fresh breakfast, and sweet indulgences in Istanbul.',
  keywords: ['café', 'coffee', 'istanbul', 'turkish coffee', 'desserts', 'breakfast', 'waffles'],
  openGraph: {
    title: 'Mardo Café',
    description: 'Your cozy corner for artisan coffee and homemade desserts',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
