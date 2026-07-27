import type { Metadata } from 'next';
import './globals.css';
import { SITE_TAGLINE, SITE_TITLE } from '@/lib/site';

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: `${SITE_TITLE} of the ${SITE_TAGLINE}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className="bg-white text-slate-700 antialiased">{children}</body>
    </html>
  );
}
