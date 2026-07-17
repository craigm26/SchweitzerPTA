import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next"
import FirstPartyAnalyticsTracker from '@/components/FirstPartyAnalyticsTracker';
import VisualPicker from '@/components/VisualPicker';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata: Metadata = {
  title: 'Schweitzer Elementary PTA',
  description: 'Schweitzer Elementary PTA Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Stop iOS Safari's data detectors from auto-linking the address / phone
            numbers / dates in the page. They rewrite the server HTML before React
            hydrates, which caused a hydration mismatch on iPad Safari only. */}
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${lexend.variable} antialiased bg-background-light dark:bg-background-dark font-sans`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <FirstPartyAnalyticsTracker />
        {process.env.NODE_ENV === 'development' && <VisualPicker />}
        <Analytics />
      </body>
    </html>
  );
}
