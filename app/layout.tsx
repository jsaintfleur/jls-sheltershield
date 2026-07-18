import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeToggle } from '@/lib/design/primitives';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'ShelterShield',
    template: '%s | ShelterShield'
  },
  description:
    'ShelterShield is a displacement-risk composite index and capital-prioritization product for community-development capital teams.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-app-accent="shelter">
      <body className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <div className="fixed right-4 top-4 z-50 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-panel)] px-3 py-2 shadow-[var(--shadow-1)]">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
