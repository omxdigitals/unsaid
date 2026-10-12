'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { BackendNotice } from './BackendNotice';
import { FeedbackButton } from './FeedbackButton';
import { Logo } from './Logo';
import { VaultAside } from './VaultAside';
import { trackReturn, type FeedbackScreen } from '@/lib/signals';

const DESTINATIONS = [
  { href: '/vault', label: 'Vault' },
  { href: '/activity', label: 'Activity' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/settings', label: 'Settings' },
] as const;

/** Page frame. Navigation is deliberately small and text-only. */
export function Shell({
  children,
  footer,
  screen,
  aside,
}: {
  children: ReactNode;
  footer?: ReactNode;
  /** Replaces the desktop side panel; pass `false` to give the page the full width. */
  aside?: ReactNode | false;
  screen: FeedbackScreen;
}) {
  // Null outside an App Router context; an empty string just means nothing is
  // marked current, which is a better failure than a crashed page frame.
  const pathname = usePathname() ?? '';

  // Counted once per week per browser, against a key that rotates weekly.
  useEffect(() => {
    trackReturn();
  }, []);

  return (
    <div className="container-page flex min-h-dvh flex-col">
      {/*
       * Same width, rules and wordmark as the front page, so moving from the
       * landing page into the vault never changes the paper underneath.
       * Stacks under `sm`: wordmark and four links do not fit a 390px phone.
       */}
      <header className="flex flex-col gap-3 pb-3 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
        <Link href="/app" className="self-start text-ink sm:self-auto" aria-label="UNSAID — open my vault">
          <Logo withWordmark size={28} />
        </Link>
        <nav aria-label="Sections" className="-mx-1 flex gap-1 overflow-x-auto text-sm">
          {DESTINATIONS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                // Knowing where you are is not decoration: this is the only
                // orientation cue in a product with no page titles.
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition-colors ${
                  active ? 'bg-ink font-medium text-paper' : 'text-ink-soft hover:bg-paper-tint hover:text-ink'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div aria-hidden="true" className="rule-double h-2" />

      <div
        className={`grid flex-1 gap-10 pt-8 sm:pt-10 lg:gap-14 ${
          aside === false ? '' : 'lg:grid-cols-[minmax(0,1fr)_18rem]'
        }`}
      >
        <main className="flex min-w-0 flex-col">
          <BackendNotice />
          {children}
        </main>
        {aside === false ? null : (aside ?? <VaultAside />)}
      </div>

      {/* Bottom padding keeps the last line clear of the fixed feedback button. */}
      <footer className="mt-12 border-t border-line pb-20 pt-6 text-xs text-ink-faint">
        {footer ?? 'Your thoughts are encrypted on this device before they are saved.'}
      </footer>
      <FeedbackButton screen={screen} />
    </div>
  );
}
