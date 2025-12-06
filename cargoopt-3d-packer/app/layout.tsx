/**
 * Root Layout Component
 * Sets up the application structure with proper metadata and styling
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CargoOpt 3D Packer - Airline Cargo Loading Game',
  description:
    'A 3D puzzle game where you act as a Load Master to fit passenger luggage into an aircraft cargo hold. Manage space efficiently and complete each flight!',
  keywords: ['3D game', 'puzzle', 'cargo loading', 'airline', 'logistics'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cargoopt-3d-packer.vercel.app',
    siteName: 'CargoOpt 3D Packer',
    title: 'CargoOpt 3D Packer - Airline Cargo Loading Game',
    description: 'Load passenger luggage into aircraft cargo holds in this 3D puzzle game',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CargoOpt 3D Packer',
    description: 'A 3D puzzle game for airline cargo loading',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950`}>{children}</body>
    </html>
  );
}
