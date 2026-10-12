import type { Metadata } from 'next';
import { Deck } from '../Deck';

/** Slides that do not fit in three minutes: for Q&A, Demo Day and investor meetings. */
export const metadata: Metadata = {
  title: 'UNSAID — appendix',
  robots: { index: false, follow: false },
};

export default function AppendixDeckPage() {
  return <Deck deck="appendix" />;
}
