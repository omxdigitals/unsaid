import type { Metadata } from 'next';
import { Deck } from './Deck';

/**
 * The Colosseum pitch video: three minutes, seven beats, timed per slide.
 * Siblings: /pitch/tech (the technical demo video) and /pitch/appendix (Q&A).
 *
 * The Colosseum pitch, as a page of the product it is about. Running inside
 * the app means the demos on its slides are the real components — the
 * encryption on slide 5 is the same code a user's vault runs.
 */
export const metadata: Metadata = {
  title: 'UNSAID — the pitch',
  description: 'Private by design: a journal with an AI that cannot read your secrets.',
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <Deck deck="pitch" />;
}
