import type { Metadata } from 'next';
import { Deck } from '../Deck';

/** The technical demo video: how it is built and how it uses Solana. Two to three minutes. */
export const metadata: Metadata = {
  title: 'UNSAID — technical demo',
  robots: { index: false, follow: false },
};

export default function TechDeckPage() {
  return <Deck deck="tech" />;
}
