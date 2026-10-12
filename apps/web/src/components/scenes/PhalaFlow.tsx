'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { useInView } from '@/lib/useInView';
import { LockIcon } from './SealLoop';

/**
 * How one Echo reflection runs on the attested path, as a five-beat diagram.
 *
 * It mirrors the code, not a wish: `routes/echo.ts` refuses without the current
 * consent version and never persists the plaintext; `lib/ai/phala.ts` reads the
 * enclave's measurement first and routes only to a verified confidential
 * instance; `lib/consent-ledger.ts` writes the receipt — consent version,
 * measurement, result hash, time, and no content.
 *
 * Controlled (`step`) on the pitch deck, where each click is one beat; looping
 * (`autoplay`) on the Privacy Centre.
 */

export const PHALA_STEPS = [
  { title: 'You ask', caption: 'You tap Reflect on one memory and confirm the disclosure (v1).' },
  {
    title: 'Opened on your phone',
    caption: 'That one memory is decrypted on your device and sent over TLS. Our API relays it and writes nothing down.',
  },
  {
    title: 'Read inside a sealed chip',
    caption: 'The model runs in an Intel TDX + NVIDIA confidential enclave. The hardware signs which code was loaded.',
  },
  {
    title: 'Back, and sealed again',
    caption: 'The reply returns to your phone and is encrypted there before it is stored. We keep only ciphertext.',
  },
  {
    title: 'A receipt anyone can check',
    caption: 'A content-free receipt lands on Solana: consent version, enclave measurement, reply hash, time.',
  },
] as const;

export function PhalaFlow({
  step: controlled,
  autoplay = false,
  showCaption = true,
}: {
  step?: number;
  autoplay?: boolean;
  showCaption?: boolean;
}) {
  const [auto, setAuto] = useState(1);
  const [ref, inView] = useInView<HTMLDivElement>();
  useEffect(() => {
    if (!autoplay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAuto(PHALA_STEPS.length);
      return;
    }
    if (!inView) return;
    const t = setInterval(() => setAuto((s) => (s % PHALA_STEPS.length) + 1), 2600);
    return () => clearInterval(t);
  }, [autoplay, inView]);

  // Beats are 1-based: 0 shows the empty stage, 5 shows everything.
  const step = controlled ?? auto;
  const at = (n: number) => step >= n;

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr] items-stretch gap-1 sm:grid-cols-[1fr_3rem_1fr_3rem_1fr] sm:gap-2">
        <Node label="Your phone" active={step === 1 || step === 2 || step === 4} icon="phone">
          {at(1) && (
            <Chip className={step === 1 ? 'animate-rise' : ''}>
              <Icon name="check" size={12} className="inline" /> Consent v1
            </Chip>
          )}
          {at(4) && (
            <Chip tone="safe" className="animate-rise">
              <LockIcon className="inline" /> Re-sealed
            </Chip>
          )}
        </Node>

        <Wire live={step === 2} back={step === 4} />

        <Node label="Unsaid API" active={step === 2} icon="arrows" dashed>
          {at(2) && (
            <Chip className="animate-rise">
              Relay only
              <span className="ml-1 line-through decoration-ember decoration-2">disk</span>
            </Chip>
          )}
        </Node>

        <Wire live={step === 3} back={step === 4} />

        <Node
          label="Phala enclave"
          active={step === 3}
          icon="cpu"
          glow={step === 3}
          sub="Intel TDX · NVIDIA CC"
        >
          {at(3) && (
            <Chip tone="safe" className="animate-rise font-mono">
              sha256:7c1e…a90f
            </Chip>
          )}
        </Node>
      </div>

      {/* The chain, under everything. */}
      <div className="relative flex min-h-16 items-center gap-2 overflow-hidden rounded-xl border border-dashed border-field bg-paper-tint px-3 py-2">
        <span className="kicker flex shrink-0 items-center gap-1.5"><Icon name="chain" size={14} /> Solana</span>
        <div className="flex flex-1 items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-7 w-10 rounded-md border border-line bg-paper-raised" />
          ))}
          {at(5) && (
            <span className="animate-drop rounded-md border-2 border-brand bg-brand px-2 py-1 font-mono text-[0.625rem] leading-tight text-on-brand sm:text-[0.6875rem]">
              receipt · v1 · 7c1e… · 3b0d… · no content
            </span>
          )}
        </div>
      </div>

      {showCaption && (
        <ol className="grid gap-2 sm:grid-cols-5">
          {PHALA_STEPS.map((s, i) => (
            <li
              key={s.title}
              className={`border-t-[3px] pt-2 text-xs leading-snug transition-opacity duration-500 ${
                step === i + 1
                  ? 'border-brand text-ink'
                  : step > i + 1
                    ? 'border-line text-ink-soft'
                    : 'border-line text-ink-faint opacity-50'
              }`}
            >
              <span className="block font-display text-sm font-bold">
                {i + 1}. {s.title}
              </span>
              {s.caption}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Node({
  label,
  sub,
  icon,
  active,
  glow,
  dashed,
  children,
}: {
  label: string;
  sub?: string;
  icon: IconName;
  active: boolean;
  glow?: boolean;
  dashed?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex min-h-36 flex-col gap-2 rounded-xl border-2 p-2.5 transition-colors duration-500 sm:p-3 ${
        active ? 'border-brand bg-paper-raised' : 'border-line bg-paper-raised'
      } ${dashed ? 'border-dashed' : ''} ${glow ? 'animate-glow' : ''}`}
    >
      <span className={active ? 'text-brand-strong' : 'text-ink-soft'}>
        <Icon name={icon} size={26} />
      </span>
      <span className="font-display text-sm font-bold leading-tight text-ink sm:text-base">
        {label}
      </span>
      {sub && <span className="text-[0.625rem] text-ink-faint sm:text-[0.6875rem]">{sub}</span>}
      <div className="mt-auto flex flex-col items-start gap-1">{children}</div>
    </div>
  );
}

function Chip({
  children,
  tone = 'brand',
  className = '',
}: {
  children: ReactNode;
  tone?: 'brand' | 'safe';
  className?: string;
}) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[0.58rem] leading-tight sm:px-2 sm:text-[0.6875rem] ${
        tone === 'safe' ? 'border-safe bg-safe-wash text-safe' : 'border-brand text-brand-strong'
      } ${className}`}
    >
      {children}
    </span>
  );
}

/** A connector with a packet travelling along it while live. */
function Wire({ live, back }: { live: boolean; back: boolean }) {
  return (
    <div className="relative flex items-center" aria-hidden="true">
      <div className={`h-0.5 w-full ${live || back ? 'bg-brand' : 'bg-line'}`} />
      {(live || back) && (
        <span
          className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 animate-travel rounded-full bg-accent ${
            back ? '[animation-direction:reverse]' : ''
          }`}
        />
      )}
    </div>
  );
}
