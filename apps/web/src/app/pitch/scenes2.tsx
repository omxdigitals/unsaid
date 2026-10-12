'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/Icon';

/*
 * Looping scenes for the deck — each one plays like a GIF on its slide and can
 * be screen-recorded as one. All motion stops at its end state under
 * prefers-reduced-motion.
 */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------------ */
/* The same sentence, two pipelines.                                         */
/* ------------------------------------------------------------------------ */

type Stage = { icon: IconName; label: string; readable: string; sealed: string };

const TYPICAL: Stage[] = [
  { icon: 'pen', label: 'You type', readable: '“I can’t sleep”', sealed: '' },
  { icon: 'server', label: 'Their server', readable: '“I can’t sleep”', sealed: '' },
  { icon: 'database', label: 'Their database', readable: '“I can’t sleep”', sealed: '' },
  { icon: 'cpu', label: 'Training set', readable: '“I can’t sleep”', sealed: '' },
];

const OURS: Stage[] = [
  { icon: 'pen', label: 'You type', readable: '“I can’t sleep”', sealed: '“I can’t sleep”' },
  { icon: 'lock', label: 'Sealed on phone', readable: '', sealed: 'x9Kq…Zt_4' },
  { icon: 'server', label: 'Our server', readable: '', sealed: 'x9Kq…Zt_4' },
  { icon: 'block', label: 'Solana', readable: '', sealed: 'receipt · no content' },
];

function Pipeline({ title, stages, at, good }: { title: string; stages: Stage[]; at: number; good: boolean }) {
  return (
    <div className={`rounded-3xl border-2 p-5 ${good ? 'border-brand bg-paper-raised' : 'border-line bg-paper-raised'}`}>
      <p className={`kicker ${good ? '' : '!text-ember'}`}>{title}</p>
      <ol className="mt-4 grid grid-cols-4 gap-2">
        {stages.map((s, i) => {
          const lit = at >= i;
          const text = good ? s.sealed || s.readable : s.readable;
          const exposed = !good && i > 0;
          return (
            <li key={s.label} className="flex flex-col items-center gap-2 text-center">
              <span
                className={`grid size-12 place-items-center rounded-2xl transition-all duration-500 sm:size-14 ${
                  lit
                    ? good
                      ? 'bg-brand text-on-brand'
                      : exposed
                        ? 'bg-ember text-paper'
                        : 'bg-ink text-paper'
                    : 'bg-paper-tint text-ink-faint'
                } ${at === i ? 'scale-110' : ''}`}
              >
                <Icon name={s.icon} size={24} strokeWidth={1.9} />
              </span>
              <span className="text-[0.7rem] font-semibold leading-tight text-ink sm:text-xs">{s.label}</span>
              <span
                className={`min-h-8 rounded-md px-1.5 py-1 font-mono text-[0.6rem] leading-tight transition-opacity duration-500 sm:text-[0.65rem] ${
                  lit ? 'opacity-100' : 'opacity-0'
                } ${good ? (i === 0 ? 'text-ink' : 'bg-brand-wash text-brand-strong') : exposed ? 'bg-[#fde2df] text-ember' : 'text-ink'}`}
              >
                {text}
              </span>
            </li>
          );
        })}
      </ol>
      <p className={`mt-4 text-sm font-semibold transition-opacity duration-500 ${at >= 3 ? 'opacity-100' : 'opacity-0'} ${good ? 'text-safe' : 'text-ember'}`}>
        {good ? 'Readable only on your phone. Provable by anyone.' : 'Readable by engineers, logs, backups — and the model.'}
      </p>
    </div>
  );
}

export function DualPipeline() {
  const reduced = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (reduced) {
      setAt(3);
      return;
    }
    const t = setInterval(() => setAt((a) => (a >= 5 ? 0 : a + 1)), 1100);
    return () => clearInterval(t);
  }, [reduced]);
  const step = Math.min(at, 3);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Pipeline title="A typical AI app" stages={TYPICAL} at={step} good={false} />
      <Pipeline title="UNSAID" stages={OURS} at={step} good />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* A Solana block stream with receipts landing in it.                        */
/* ------------------------------------------------------------------------ */

type Block = { slot: number; receipt: boolean; hash: string };

const HEX = '0123456789abcdef';
function hash() {
  let h = '';
  for (let i = 0; i < 4; i += 1) h += HEX[Math.floor(Math.random() * 16)];
  return `${h}…${HEX[Math.floor(Math.random() * 16)]}${HEX[Math.floor(Math.random() * 16)]}`;
}

export function ChainStream() {
  const reduced = useReducedMotion();
  const slot = useRef(318_402_100);
  const [blocks, setBlocks] = useState<Block[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({ slot: 318_402_094 + i, receipt: i === 3, hash: 'a1f0…3c' })),
  );
  const [latest, setLatest] = useState<Block | null>(null);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      slot.current += 1;
      const b = { slot: slot.current, receipt: slot.current % 3 === 0, hash: hash() };
      setBlocks((prev) => [...prev.slice(-5), b]);
      if (b.receipt) setLatest(b);
    }, 900);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <div className="overflow-hidden rounded-3xl bg-night p-5 text-paper sm:p-6">
      <div className="flex items-center justify-between text-xs text-[#a8988b]">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-brand" />
          </span>
          Solana · devnet · ~400 ms slots
        </span>
        <span className="font-mono">slot {blocks[blocks.length - 1]!.slot.toLocaleString()}</span>
      </div>

      <div className="mt-5 flex items-end gap-2">
        {blocks.map((b, i) => (
          <div
            key={b.slot}
            className={`flex min-w-0 flex-1 flex-col gap-1 rounded-xl border p-2 transition-all duration-500 ${
              b.receipt ? 'border-brand bg-brand/15' : 'border-night-line bg-night-raised'
            } ${i === blocks.length - 1 ? 'animate-drop' : ''}`}
          >
            <span className="truncate font-mono text-[0.6rem] text-[#a8988b]">#{String(b.slot).slice(-4)}</span>
            <span className={`h-1.5 rounded-full ${b.receipt ? 'bg-brand' : 'bg-night-line'}`} />
            <span className="h-1.5 w-2/3 rounded-full bg-night-line" />
            {b.receipt && <span className="text-[0.55rem] font-semibold text-brand">receipt</span>}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-night-line bg-night-raised p-4 font-mono text-[0.7rem] leading-relaxed sm:text-xs">
        <p className="mb-2 font-sans text-xs font-semibold text-brand">Latest consent receipt</p>
        <p>
          <span className="text-[#a8988b]">purpose      </span>reflection
        </p>
        <p>
          <span className="text-[#a8988b]">consent      </span>v1
        </p>
        <p>
          <span className="text-[#a8988b]">attestation  </span>sha256:{latest?.hash ?? '7c1e…a9'}
        </p>
        <p>
          <span className="text-[#a8988b]">result_hash  </span>{latest ? hash() : '3b0d…e2'}
        </p>
        <p>
          <span className="text-[#a8988b]">content      </span>
          <span className="rounded bg-brand px-1.5 text-on-brand">none — 0 bytes</span>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Count-up for headline numbers.                                            */
/* ------------------------------------------------------------------------ */

/** Animates the first number in `value` from 0, keeping its prefix, suffix and decimals. */
export function CountUp({ value, ms = 900 }: { value: string; ms?: number }) {
  const reduced = useReducedMotion();
  const match = /^(\D*)([\d,.]+)(.*)$/.exec(value);
  const [shown, setShown] = useState(reduced || !match ? value : '');

  useEffect(() => {
    if (!match || reduced) {
      setShown(value);
      return;
    }
    const [, pre, num, post] = match;
    const target = Number(num!.replace(/,/g, ''));
    const decimals = (num!.split('.')[1] ?? '').length;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / ms, 1);
      const eased = 1 - (1 - p) ** 3;
      setShown(`${pre}${(target * eased).toFixed(decimals)}${post}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return <span className="tabular-nums">{shown || value}</span>;
}
