'use client';

import { useState } from 'react';

/** Horizontal bars, one hue, value at the end of each bar, hover read-out. */
export function Bars({
  rows,
  max,
  unit,
  ariaLabel,
}: {
  rows: { label: string; value: number; detail?: string }[];
  max: number;
  /** Appended to each value label; a string because a server component renders this. */
  unit: string;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div role="img" aria-label={ariaLabel} className="flex flex-col gap-2.5">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className="group grid grid-cols-[4.5rem_1fr] items-center gap-3"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          <span className="text-right font-mono text-xs text-ink-soft">{r.label}</span>
          <div className="relative flex h-7 items-center">
            <div
              className={`h-full rounded-r-[4px] transition-opacity ${hover === null || hover === i ? 'bg-brand-bright' : 'bg-brand-bright opacity-40'}`}
              style={{ width: `max(${(r.value / max) * 78}%, 3px)` }}
            />
            <span className="ml-2 whitespace-nowrap font-mono text-xs text-ink">{`${r.value} ${unit}`}</span>
            {hover === i && r.detail && (
              <span className="absolute -top-8 left-0 z-10 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[0.7rem] text-paper shadow">
                {r.detail}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

