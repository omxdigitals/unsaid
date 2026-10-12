import { Icon } from '@/components/Icon';

/*
 * Server-rendered motion: pure CSS loops, no JavaScript and no timers, so
 * they cost nothing to hydrate. All stop under prefers-reduced-motion via the
 * global rule in globals.css.
 */

/** Card art for "Sealed on your phone": a sentence and its ciphertext trading places. */
export function SealArt() {
  return (
    <div aria-hidden="true" className="relative grid h-28 place-items-center overflow-hidden rounded-2xl bg-paper-tint">
      <span className="absolute animate-swap-a font-serif text-lg text-ink">I can&rsquo;t sleep.</span>
      <span className="absolute animate-swap-b font-mono text-sm text-brand-strong">x9Kq·Zt_4·aB0e</span>
      <span className="absolute bottom-2 right-3 grid size-7 place-items-center rounded-full bg-ink text-paper">
        <Icon name="lock" size={14} strokeWidth={2.2} />
      </span>
    </div>
  );
}

/** Card art for Echo: the chip that reads one memory, pulsing while it works. */
export function ChipArt() {
  return (
    <div aria-hidden="true" className="relative grid h-28 place-items-center overflow-hidden rounded-2xl bg-paper-tint">
      <span className="absolute size-14 animate-ring rounded-2xl border-2 border-brand" />
      <span className="absolute size-14 animate-ring rounded-2xl border-2 border-brand [animation-delay:1.2s]" />
      <span className="relative grid size-14 place-items-center rounded-2xl bg-ink text-brand">
        <Icon name="cpu" size={28} strokeWidth={1.8} />
      </span>
    </div>
  );
}

/** Card art for "Receipted on Solana": blocks in a row, the newest dropping in. */
export function ChainArt() {
  return (
    <div aria-hidden="true" className="relative flex h-28 items-end justify-center gap-1.5 overflow-hidden rounded-2xl bg-paper-tint px-4 pb-5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-9 w-12 rounded-lg border border-line bg-paper-raised" />
      ))}
      <span className="flex h-9 w-12 animate-fall items-center justify-center rounded-lg bg-brand font-mono text-[0.55rem] font-semibold text-on-brand">
        212 B
      </span>
      <span className="absolute left-0 right-0 bottom-[1.2rem] -z-0 h-px bg-line" />
    </div>
  );
}
