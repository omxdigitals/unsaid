'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '@/components/Icon';

/**
 * The research, drawn. Every value is copied from docs/paper/benchmarks.md
 * (run 9 Oct 2026, Intel i5-5250U — a 2015 laptop, deliberately unflattering)
 * and docs/paper/research-notes.md. Nothing here is fetched or computed live.
 *
 * Charts follow one rule set: a single hue per chart (orange), so no legend is
 * needed; values are direct-labelled; every mark has a hover read-out; and a
 * comparison of two series is drawn as two small panels rather than two hues.
 */

/* ---------- data ---------- */

export const ENVELOPE = [
  { size: '1 KB', seal: 0.5, open: 0.3 },
  { size: '10 KB', seal: 0.5, open: 0.3 },
  { size: '100 KB', seal: 0.9, open: 0.4 },
  { size: '1 MB', seal: 6.3, open: 2.9 },
  { size: '10 MB', seal: 83.4, open: 37.9 },
];

export const CANARY = [
  { where: 'Whole database', searched: '244 KB pg_dump, every table', found: 0 },
  { where: 'Object storage', searched: '806 objects, 46 KB', found: 0 },
  { where: 'API logs', searched: '34 KB of captured output', found: 0 },
];

/** Monthly chain cost per user at three reflection rates. Batched = per-receipt ÷ 20. */
export const COST = [
  { rate: '5 / mo', today: 0.64, batched: 0.03 },
  { rate: '20 / mo', today: 2.56, batched: 0.13 },
  { rate: '60 / mo', today: 7.68, batched: 0.38 },
];

const PRIOR_ART = {
  columns: ['Encrypted storage', 'Attested AI', 'Public per-access receipt'],
  rows: [
    { name: 'Consumer AI chatbots', cells: [false, false, false] },
    { name: 'End-to-end encrypted note apps', cells: [true, false, false] },
    { name: 'Confidential-cloud AI (e.g. Apple PCC)', cells: [false, true, false] },
    { name: 'UNSAID', cells: [true, true, true], us: true },
  ],
};

/* ---------- small pieces ---------- */

function Panel({
  kicker,
  title,
  children,
  note,
  className = '',
}: {
  kicker: string;
  title: ReactNode;
  children: ReactNode;
  note?: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`flex w-full min-w-0 flex-col rounded-3xl border border-line bg-paper-raised p-6 sm:p-7 ${className}`}>
      <p className="kicker">{kicker}</p>
      <figcaption className="mt-2 font-display text-xl font-bold leading-snug text-ink">{title}</figcaption>
      <div className="mt-6 flex-1">{children}</div>
      {note && <p className="mt-5 border-t border-line pt-3 text-xs leading-relaxed text-ink-faint">{note}</p>}
    </figure>
  );
}

/** Horizontal bars, one hue, value at the end of each bar, hover read-out. */
function Bars({
  rows,
  max,
  format,
  ariaLabel,
}: {
  rows: { label: string; value: number; detail?: string }[];
  max: number;
  format: (v: number) => string;
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
            <span className="ml-2 whitespace-nowrap font-mono text-xs text-ink">{format(r.value)}</span>
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

/* ---------- the charts ---------- */

export function EnvelopeChart() {
  return (
    <Panel
      kicker="Encryption cost"
      title="Sealing a memory takes milliseconds — even a 10 MB voice note."
      note="AES-GCM-256 per memory, key wrapped with AES-KW. Median of 20 runs (5 at ≥1 MB). 2015 laptop."
    >
      <Bars
        ariaLabel="Seal time by payload size: 1 KB 0.5 ms, 10 KB 0.5 ms, 100 KB 0.9 ms, 1 MB 6.3 ms, 10 MB 83.4 ms."
        rows={ENVELOPE.map((e) => ({
          label: e.size,
          value: e.seal,
          detail: `${e.size}: seal ${e.seal} ms · open ${e.open} ms`,
        }))}
        max={83.4}
        format={(v) => `${v} ms`}
      />
    </Panel>
  );
}

export function SaveBreakdown() {
  const total = 171;
  const seal = 1.6;
  return (
    <Panel
      kicker="Where the time goes"
      title={
        <>
          Encryption is <span className="text-brand-strong">under 1%</span> of saving.
        </>
      }
      note="Client seals → ciphertext to object storage → metadata to the API. n=30, median, local infrastructure."
    >
      <div role="img" aria-label="Of a 171 millisecond save, 1.6 milliseconds is encryption and 169.4 is network and database.">
        <div className="flex h-10 gap-[2px] overflow-hidden rounded-[4px]">
          <div className="h-full bg-brand-bright" style={{ width: `${(seal / total) * 100}%`, minWidth: 6 }} title="Encryption: 1.6 ms" />
          <div className="h-full flex-1 bg-line" title="Network and database: 169.4 ms" />
        </div>
        <div className="mt-3 flex justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-ink">
            <span className="size-2.5 rounded-sm bg-brand-bright" /> Encryption · 1.6 ms
          </span>
          <span className="text-ink-soft">Network + database · 169.4 ms</span>
        </div>
        <p className="mt-6 font-display text-5xl font-black text-ink">
          171<span className="text-2xl text-ink-faint"> ms</span>
        </p>
        <p className="text-xs text-ink-faint">full save, median · p95 203 ms</p>
      </div>
    </Panel>
  );
}

export function ReceiptLatency() {
  // A range strip: min, median, p95, max on one linear axis.
  const min = 685;
  const max = 4623;
  const pos = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const marks = [
    { v: 685, label: 'fastest', t: '685 ms' },
    { v: 1132, label: 'median', t: '1.1 s' },
    { v: 2823, label: 'p95', t: '2.8 s' },
    { v: 4623, label: 'slowest', t: '4.6 s' },
  ];
  return (
    <Panel
      kicker="On Solana"
      title={
        <>
          <span className="text-brand-strong">98 of 100</span> receipts confirmed, median 1.1 s.
        </>
      }
      note="Devnet, written one at a time. Both failures were the free public endpoint's WebSocket dropping, not the program rejecting anything."
    >
      <div role="img" aria-label="Receipt confirmation time: fastest 685 ms, median 1.1 s, 95th percentile 2.8 s, slowest 4.6 s.">
        <div className="relative mx-2 mt-12 h-2 rounded-full bg-line">
          <div className="absolute inset-y-0 rounded-full bg-brand-wash" style={{ left: pos(685), width: pos(2823) }} />
          {marks.map((m) => {
            const end = m.label === 'fastest' || m.label === 'slowest';
            return (
              <div key={m.label} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: pos(m.v) }}>
                <span
                  className={`block rounded-full border-2 border-paper-raised ${m.label === 'median' ? 'size-4 bg-brand-bright' : 'size-3 bg-ink-faint'}`}
                  title={`${m.label}: ${m.t}`}
                />
                {!end && (
                  <span className="absolute -top-9 left-1/2 flex -translate-x-1/2 flex-col items-center whitespace-nowrap leading-tight">
                    <span className="font-mono text-[0.7rem] font-semibold text-ink">{m.t}</span>
                    <span className="text-[0.6rem] text-ink-faint">{m.label}</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mx-0 mt-3 flex justify-between font-mono text-[0.65rem] text-ink-faint">
          <span>fastest 685 ms</span>
          <span>slowest 4.6 s</span>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-ink-faint">Receipt size</dt>
            <dd className="font-display text-2xl font-black text-ink">212 B</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-faint">Of a transaction</dt>
            <dd className="font-display text-2xl font-black text-ink">17.2%</dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
}

export function CanarySweep() {
  return (
    <Panel
      kicker="The privacy invariant"
      title="We hid 30 secrets, then searched everywhere they could leak."
      note="backend/api/scripts/canary-sweep.ts. A control decrypts memory 1 and asserts the marker is there, so an empty search cannot pass by accident."
    >
      <ul className="flex flex-col divide-y divide-line">
        {CANARY.map((c) => (
          <li key={c.where} className="flex items-center gap-4 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-safe-wash text-safe">
              <Icon name="check" size={16} strokeWidth={2.6} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">{c.where}</span>
              <span className="block text-xs text-ink-faint">{c.searched}</span>
            </span>
            <span className="text-right">
              <span className="block font-display text-2xl font-black text-ink">{c.found}</span>
              <span className="block text-[0.65rem] text-ink-faint">found</span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function CostPanels() {
  const max = 8;
  const panel = (key: 'today' | 'batched', label: string, kind: string) => (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        {label}
        <span
          className={`rounded-full border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em] ${kind === 'measured' ? 'border-safe text-safe' : 'border-dashed border-ink-faint text-ink-faint'}`}
        >
          {kind}
        </span>
      </p>
      <div className="mt-4 flex h-40 items-end gap-3 border-b border-ink-faint">
        {COST.map((c) => (
          <div key={c.rate} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-[0.7rem] text-ink">${c[key].toFixed(2)}</span>
            <div
              className="w-full max-w-10 rounded-t-[4px] bg-brand-bright"
              style={{ height: `max(${(c[key] / max) * 100}%, 3px)` }}
              title={`${c.rate}: $${c[key].toFixed(2)} per user per month`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-3">
        {COST.map((c) => (
          <span key={c.rate} className="flex-1 text-center text-[0.65rem] text-ink-faint">
            {c.rate}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <Panel
      kicker="Unit economics"
      title="Receipts cost real money today. Batching makes them a rounding error."
      note="Per user per month, by reflections per month, against an $8 plan (axis top). Today: one rent-exempt account per receipt at $73.85/SOL (22 Jun 2026 quote). Batched: one Merkle root per period, ~20× cheaper — not yet built."
    >
      <div className="grid grid-cols-2 gap-6">
        {panel('today', 'Today', 'measured')}
        {panel('batched', 'Batched', 'projected')}
      </div>
    </Panel>
  );
}

export function PriorArt() {
  return (
    <Panel
      kicker="Prior art"
      title="Each piece exists somewhere. Nobody binds all three, per access, in public."
      note="Our contribution, from docs/paper/research-notes.md: binding attestation, consent version and a content-free receipt — per access, on a public ledger — over end-to-end encrypted personal data."
    >
      {/* Phones: one card per approach. A table this wide widens the whole page there. */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {PRIOR_ART.rows.map((r) => (
          <li key={r.name} className={`rounded-2xl border p-4 ${r.us ? 'border-brand bg-brand-wash' : 'border-line'}`}>
            <p className={`${r.us ? 'font-display font-black' : 'font-semibold'} text-ink`}>{r.name}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {PRIOR_ART.columns.map((c, i) => (
                <li key={c} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink-soft">{c}</span>
                  {r.cells[i] ? (
                    <span className="inline-grid size-5 place-items-center rounded-full bg-ink text-paper">
                      <Icon name="check" size={11} strokeWidth={3} />
                      <span className="sr-only">Yes</span>
                    </span>
                  ) : (
                    <span className="text-ink-faint">
                      —<span className="sr-only">No</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink">
              <th className="py-2 pr-3 font-medium text-ink-faint">Approach</th>
              {PRIOR_ART.columns.map((c) => (
                <th key={c} className="px-2 py-2 text-center font-medium text-ink-faint">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRIOR_ART.rows.map((r) => (
              <tr key={r.name} className={`border-b border-line last:border-0 ${r.us ? 'bg-brand-wash' : ''}`}>
                <td className={`py-3 pr-3 ${r.us ? 'pl-3 font-display font-black text-ink' : 'text-ink'}`}>{r.name}</td>
                {r.cells.map((yes, i) => (
                  <td key={i} className="px-2 py-3 text-center">
                    {yes ? (
                      <span className="inline-grid size-6 place-items-center rounded-full bg-ink text-paper">
                        <Icon name="check" size={13} strokeWidth={3} />
                        <span className="sr-only">Yes</span>
                      </span>
                    ) : (
                      <span className="text-ink-faint">
                        —<span className="sr-only">No</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/** The whole research block, for the landing page and /research. */
export function ResearchGrid() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 lg:grid-cols-6">
      <div className="flex min-w-0 lg:col-span-3">
        <CanarySweep />
      </div>
      <div className="flex min-w-0 lg:col-span-3">
        <SaveBreakdown />
      </div>
      <div className="flex min-w-0 lg:col-span-2">
        <EnvelopeChart />
      </div>
      <div className="flex min-w-0 lg:col-span-2">
        <ReceiptLatency />
      </div>
      <div className="flex min-w-0 md:col-span-2 lg:col-span-2">
        <CostPanels />
      </div>
      <div className="flex min-w-0 md:col-span-2 lg:col-span-6">
        <PriorArt />
      </div>
    </div>
  );
}
