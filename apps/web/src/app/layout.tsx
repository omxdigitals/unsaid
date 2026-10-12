import type { Metadata, Viewport } from 'next';
import { Archivo, Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { VaultProvider } from '@/lib/vault';
import { WalletProvider } from '@/lib/wallet';
import './globals.css';

/*
 * Self-hosted at build time by next/font, so no visitor's browser ever asks
 * Google for a font — on a privacy product that request would be a leak of its
 * own. Archivo carries the headlines, Fraunces the nameplate and wordmark,
 * Inter the interface,
 * JetBrains Mono the ciphertext and hashes, which are content here.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UNSAID',
  description: 'A private place for the things you cannot say out loud.',
  // The vault is personal; keep it out of search indexes entirely.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#f8f5ef',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh antialiased">
        <VaultProvider>
          <WalletProvider>{children}</WalletProvider>
        </VaultProvider>
      </body>
    </html>
  );
}
