import Link from 'next/link';
import { Logo } from '@/components/Logo';

/**
 * The app had no 404. A framework default page on a privacy product reads as
 * though something broke open, which is the last impression this should give.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6">
      <header className="pb-3 pt-8">
        <Link href="/" className="text-ink" aria-label="UNSAID — home">
          <Logo withWordmark />
        </Link>
        <div aria-hidden="true" className="rule-double mt-3 h-2" />
      </header>
      <main className="flex flex-1 flex-col justify-center py-16">
        <p className="font-display text-8xl font-black leading-none text-brand-display">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
          This page was never written.
        </h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
          There is nothing at this address. Your vault is untouched. Nothing here is ever addressable by guessing a link — a memory
          opens only on a device holding your phrase.
        </p>
        <Link
          href="/vault"
          className="mt-8 self-start rounded-full bg-brand px-6 py-3 font-medium text-on-brand hover:bg-brand-bright"
        >
          Back to your vault
        </Link>
      </main>
    </div>
  );
}
