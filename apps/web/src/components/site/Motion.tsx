'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { useInView } from '@/lib/useInView';

/**
 * Fades and lifts its children in the first time they scroll into view.
 * Used below the fold only — anything in the first screen must paint at once,
 * or it would delay Largest Contentful Paint for a decoration.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, shown] = useInView<HTMLDivElement>({ once: true, rootMargin: '0px 0px -10% 0px' });
  return (
    <div
      ref={ref}
      data-shown={shown}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/**
 * A compact header that slides in once the masthead has scrolled away, so
 * the way into the app is always one tap from anywhere on a long page.
 */
export function StickyBar({ links }: { links: { href: string; label: string }[] }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md transition-transform duration-300 ${
        shown ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
        <Link href="/" tabIndex={shown ? 0 : -1} className="text-ink" aria-label="UNSAID — home">
          <Logo withWordmark size={22} />
        </Link>
        <nav aria-label="Quick" className="flex items-center gap-5 text-sm text-ink-soft">
          {links.map((l) => (
            <Link key={l.href} href={l.href} tabIndex={shown ? 0 : -1} className="hidden hover:text-brand-strong md:inline">
              {l.label}
            </Link>
          ))}
          <Link
            href="/app"
            tabIndex={shown ? 0 : -1}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 font-medium text-on-brand transition-colors hover:bg-brand-bright"
          >
            Start writing
            <Icon name="arrowRight" size={15} strokeWidth={2.2} />
          </Link>
        </nav>
      </div>
    </div>
  );
}
