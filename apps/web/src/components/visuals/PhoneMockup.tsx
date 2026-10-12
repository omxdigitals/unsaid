'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';

/**
 * A phone running UNSAID, drawn in CSS: titanium edge, screen, status bar,
 * dynamic island. The screen cycles through the real flow — write, seal,
 * receipt — so the hero shows the product rather than describing it.
 *
 * Illustration only; nothing here encrypts. `LiveSeal` is the real thing.
 */

const LINE = 'I haven’t told anyone how tired I am.';
const NOISE = 'q3Vt9_xKe2ZmA0p-LrW8sHn4cY7bJ1uGfD6oTiE5';

type Phase = 'write' | 'seal' | 'saved';

export function PhoneMockup({ className = '' }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>('write');
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(LINE.length);
      setPhase('saved');
      return;
    }
    if (phase === 'write') {
      if (typed < LINE.length) {
        const t = setTimeout(() => setTyped((n) => n + 1), 55);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('seal'), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        if (phase === 'seal') setPhase('saved');
        else {
          setTyped(0);
          setPhase('write');
        }
      },
      phase === 'seal' ? 1200 : 3200,
    );
    return () => clearTimeout(t);
  }, [phase, typed]);

  return (
    <div
      role="img"
      aria-label="The UNSAID app on a phone: a sentence is written, sealed on the device, and a receipt is recorded on Solana."
      className={`relative mx-auto aspect-[9/19] w-[min(19rem,78vw)] ${className}`}
    >
      {/* Body: a two-tone edge reads as metal; the long soft shadow grounds it on paper. */}
      <div className="absolute inset-0 rounded-[2.9rem] bg-gradient-to-b from-[#3a302a] via-[#1a1410] to-[#3a302a] p-[0.55rem] shadow-[0_40px_80px_-30px_rgba(26,20,16,0.55),0_18px_30px_-18px_rgba(26,20,16,0.45)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2.4rem] bg-paper">
          {/* Status bar and island */}
          <div className="relative flex h-10 shrink-0 items-center justify-between px-6 pt-1 text-[0.65rem] font-semibold text-ink">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[1.35rem] w-[5.5rem] -translate-x-1/2 rounded-full bg-[#0d0a08]" />
            <span className="flex items-center gap-1">
              <span className="flex items-end gap-px">
                {[3, 5, 7, 9].map((h) => (
                  <span key={h} className="w-[3px] rounded-sm bg-ink" style={{ height: h }} />
                ))}
              </span>
              <span className="ml-1 h-[9px] w-[18px] rounded-[3px] border border-ink p-px">
                <span className="block h-full w-3/4 rounded-[1px] bg-ink" />
              </span>
            </span>
          </div>

          {/* App bar */}
          <div className="flex items-center justify-between border-b-2 border-ink px-4 pb-2">
            <span className="font-masthead text-sm font-black tracking-wider">UNSAID</span>
            <span className="flex items-center gap-1 rounded-full bg-brand-wash px-2 py-0.5 text-[0.55rem] font-semibold text-brand-strong">
              <Icon name="lock" size={10} strokeWidth={2.4} /> Private
            </span>
          </div>

          {/* Writing surface */}
          <div className="flex flex-1 flex-col gap-3 px-4 py-4">
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-faint">Tonight, 1:12 am</p>
            <div className="min-h-[6.5rem] rounded-2xl bg-[repeating-linear-gradient(transparent_0,transparent_21px,var(--color-line)_21px,var(--color-line)_22px)] text-[0.9rem] leading-[22px]">
              {phase === 'write' ? (
                <p className="font-serif text-ink">
                  {LINE.slice(0, typed)}
                  <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-brand-strong align-middle" />
                </p>
              ) : (
                <p className="break-all font-mono text-[0.68rem] leading-[22px] text-brand-strong">
                  {NOISE}
                  {NOISE.slice(0, 18)}
                </p>
              )}
            </div>

            {phase === 'seal' && (
              <div className="flex animate-fade items-center gap-2 rounded-xl bg-paper-tint px-3 py-2 text-[0.65rem] text-ink">
                <span className="size-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                Sealing on this phone…
              </div>
            )}

            {phase === 'saved' && (
              <div className="flex animate-rise flex-col gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-paper-tint px-3 py-2 text-[0.65rem] text-ink">
                  <Icon name="check" size={12} strokeWidth={2.6} className="text-safe" />
                  Saved. Only this phone can read it.
                </div>
              </div>
            )}

            <div className="mt-auto grid grid-cols-2 gap-2">
              <span className="rounded-full bg-ink py-2 text-center text-[0.7rem] font-semibold text-paper">
                Keep privately
              </span>
              <span className="rounded-full border border-ink py-2 text-center text-[0.7rem] font-semibold text-ink">
                Let it go
              </span>
            </div>
          </div>
          <div className="mx-auto mb-2 h-1 w-24 rounded-full bg-ink/80" />
        </div>
      </div>

      {/* Floating receipt card, offset off the phone's edge like a notification. */}
      <div
        className={`absolute -right-4 top-[60%] w-[13.5rem] rounded-2xl border border-night-line bg-night p-3 text-paper shadow-[0_24px_40px_-20px_rgba(26,20,16,0.7)] transition-all duration-700 sm:-right-24 ${
          phase === 'saved' ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 text-[0.65rem]">
          <span className="grid size-6 place-items-center rounded-full bg-brand text-on-brand">
            <Icon name="block" size={13} strokeWidth={2.2} />
          </span>
          <span className="font-semibold">Receipt on Solana</span>
          <span className="ml-auto rounded-full bg-[#2f6b3a] px-1.5 py-px text-[0.55rem]">Finalized</span>
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[0.58rem] text-[#d9cfc6]">
          <dt className="text-[#a8988b]">slot</dt>
          <dd>318,402,117</dd>
          <dt className="text-[#a8988b]">hash</dt>
          <dd>9f3a…c21e</dd>
          <dt className="text-[#a8988b]">content</dt>
          <dd>none</dd>
        </dl>
      </div>

      {/* Encryption chip, opposite side. */}
      <div className="absolute -left-4 top-[44%] flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1.5 text-[0.65rem] font-semibold text-ink shadow-[0_12px_24px_-14px_rgba(26,20,16,0.5)] sm:-left-16">
        <Icon name="lock" size={12} strokeWidth={2.2} className="text-brand-strong" />
        AES-256-GCM, on device
      </div>
    </div>
  );
}
