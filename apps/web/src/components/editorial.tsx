import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Logo } from './Logo';

/**
 * The editorial kit: the handful of pieces that make a page read as a front
 * page rather than a form. Everything here is token-driven, so it inverts with
 * the theme without knowing which one it is in.
 */

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>;
}

/** Coral highlighter behind a phrase. Sweeps in once; reduced motion shows it set. */
export function Marker({ children }: { children: ReactNode }) {
  return <span className="marker animate-marker">{children}</span>;
}

export function Rule({ weight = 'thin' }: { weight?: 'thin' | 'thick' | 'double' }) {
  if (weight === 'double') return <div aria-hidden="true" className="rule-double h-2" />;
  return (
    <hr
      aria-hidden="true"
      className={weight === 'thick' ? 'border-t-[3px] border-rule' : 'border-line'}
    />
  );
}

/**
 * The masthead. Full size, it is a newspaper nameplate — "The Unsaid Times",
 * centred in the serif between a heavy rule and a double rule, with the
 * navigation as a small strip above it and the dateline below. Compact (inner
 * pages) keeps the wordmark left and the navigation right.
 */
export function Masthead({
  dateline,
  nav,
  compact = false,
}: {
  dateline?: ReactNode;
  nav?: ReactNode;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <header className="pt-5">
        <div className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-end sm:justify-between">
          <Link href="/" className="self-start text-ink" aria-label="UNSAID — home">
            <Logo withWordmark size={26} />
          </Link>
          {nav}
        </div>
        <Rule weight="double" />
        {dateline && <Dateline>{dateline}</Dateline>}
      </header>
    );
  }

  return (
    <header className="pt-4 sm:pt-5">
      <div className="flex justify-end pb-3">{nav}</div>
      <div className="border-t-[3px] border-rule" />
      <Link
        href="/"
        aria-label="The Unsaid Times — home"
        className="flex items-center justify-center gap-3 py-3 text-ink sm:gap-4 sm:py-4"
      >
        <Logo size={34} />
        <span className="font-masthead text-[clamp(1.6rem,6vw,3.75rem)] font-black uppercase leading-none tracking-[0.04em]">
          The Unsaid Times
        </span>
      </Link>
      <Rule weight="double" />
      {dateline && <Dateline>{dateline}</Dateline>}
    </header>
  );
}

function Dateline({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line py-2 text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">
      {children}
    </div>
  );
}

export type StatKind = 'measured' | 'expected' | 'projected' | 'survey';

const KIND_LABEL: Record<StatKind, string> = {
  measured: 'Measured',
  expected: 'Expected',
  projected: 'Projected',
  survey: 'Survey',
};

/**
 * A number big enough to be the point of the section. The kind tag is not
 * optional: a measured figure and an expected one must never look identical.
 */
export function StatFigure({
  value,
  label,
  source,
  kind,
  className = '',
}: {
  value: ReactNode;
  label: ReactNode;
  source?: ReactNode;
  kind: StatKind;
  className?: string;
}) {
  return (
    <figure className={`flex flex-col gap-2 ${className}`}>
      <span className="font-display text-5xl font-black leading-none tracking-tight text-brand-display sm:text-6xl">
        {value}
      </span>
      <figcaption className="flex flex-col gap-1.5">
        <span className="text-sm leading-snug text-ink">{label}</span>
        <span className="flex flex-wrap items-center gap-2 text-[0.6875rem] text-ink-faint">
          <span
            className={`rounded-full border px-2 py-0.5 uppercase tracking-[0.14em] ${
              kind === 'measured'
                ? 'border-safe text-safe'
                : 'border-dashed border-ink-faint text-ink-faint'
            }`}
          >
            {KIND_LABEL[kind]}
          </span>
          {source}
        </span>
      </figcaption>
    </figure>
  );
}

const BUTTON = {
  primary: 'bg-brand text-on-brand hover:bg-brand-bright',
  ink: 'bg-ink text-paper hover:opacity-90',
  quiet: 'border border-ink text-ink hover:bg-paper-tint',
} as const;

const SIZE = {
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base sm:text-lg',
} as const;

/** A link styled as a button. Primary is orange; inside the vault use `ink`. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof BUTTON; size?: keyof typeof SIZE }) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors ${BUTTON[variant]} ${SIZE[size]} ${className}`}
    />
  );
}

export function PullQuote({ children, cite }: { children: ReactNode; cite?: ReactNode }) {
  return (
    <blockquote className="border-l-4 border-brand pl-5">
      <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">{children}</p>
      {cite && <footer className="mt-3 text-sm text-ink-faint">{cite}</footer>}
    </blockquote>
  );
}
