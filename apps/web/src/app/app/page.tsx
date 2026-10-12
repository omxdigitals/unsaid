'use client';

import Link from 'next/link';
import { Shell } from '@/components/Shell';
import { UnlockGate } from '@/components/UnlockGate';

/**
 * Home. Blueprint §11.1: the first action is "speak" or "write" — not
 * "create a journal entry". There is no feed, no streak, and no counter.
 */
export default function HomePage() {
  return (
    <Shell screen="home">
      <UnlockGate>
        <div className="flex flex-1 flex-col justify-center py-12">
          <p className="kicker !text-ink-faint">Private · Only on this device</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-ink">What is on your mind?</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Nothing here is shared with anyone. You decide what happens to it after you finish.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Link
              href="/capture?mode=voice"
              className="group flex flex-col gap-6 rounded-2xl bg-ink p-6 text-paper hover:opacity-95"
            >
              <Glyph d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3" />
              <span className="font-display text-3xl font-bold">Talk</span>
            </Link>
            <Link
              href="/capture?mode=text"
              className="group flex flex-col gap-6 rounded-2xl border border-line bg-paper-raised p-6 text-ink hover:bg-paper-tint"
            >
              <Glyph d="M4 20h4L19 9l-4-4L4 16v4ZM13 7l4 4" />
              <span className="font-display text-3xl font-bold">Write</span>
            </Link>
          </div>
          <Link
            href="/capture?mode=text&guided=1"
            className="mt-4 self-start px-1 py-2 text-sm text-ink-faint underline-offset-4 hover:text-ink-soft hover:underline"
          >
            I do not know
          </Link>
        </div>
      </UnlockGate>
    </Shell>
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
