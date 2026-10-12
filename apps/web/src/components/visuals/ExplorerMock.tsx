'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { PROGRAM_ID } from '@/lib/chain';
import { useInView } from '@/lib/useInView';

/**
 * A block-explorer view of the consent ledger: the program, and the receipts
 * it holds. The program id is the real devnet deployment; the rows are
 * example receipts in the exact shape the program stores (see
 * programs/unsaid/src/lib.rs) — labelled as examples on the panel itself.
 */


type Row = { sig: string; purpose: string; attested: boolean; slot: string; age: string; fresh?: boolean };

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const pick = (n: number) => Array.from({ length: n }, () => B58[Math.floor(Math.random() * B58.length)]).join('');
const PURPOSES = [
  { purpose: 'Reflection', attested: true },
  { purpose: 'Anchor', attested: false },
  { purpose: 'Export', attested: false },
] as const;

const ROWS: readonly Row[] = [
  { sig: '4xQm…8KpL', purpose: 'Reflection', attested: true, slot: '318,402,117', age: '12s' },
  { sig: '2bTr…Vn9e', purpose: 'Anchor', attested: false, slot: '318,401,980', age: '1m' },
  { sig: '5hCw…Qz3a', purpose: 'Reflection', attested: true, slot: '318,398,544', age: '24m' },
  { sig: '3kLp…Ye7d', purpose: 'Export', attested: false, slot: '318,390,021', age: '1h' },
] as const;

export function ExplorerMock({ className = '' }: { className?: string }) {
  // A new receipt arrives every few seconds while the panel is on screen, so
  // the ledger reads as live. Rows are illustrative, and the panel says so.
  const [rows, setRows] = useState<Row[]>([...ROWS]);
  const slot = useRef(318_402_117);
  const [ref, inView] = useInView<HTMLDivElement>();
  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => {
      slot.current += 37 + Math.floor(Math.random() * 120);
      const kind = PURPOSES[Math.random() < 0.6 ? 0 : Math.random() < 0.5 ? 1 : 2]!;
      setRows((prev) => [
        { sig: `${pick(4)}…${pick(4)}`, ...kind, slot: slot.current.toLocaleString('en-US'), age: 'now', fresh: true },
        ...prev.slice(0, 3).map((r) => ({ ...r, fresh: false, age: r.age === 'now' ? '4s' : r.age })),
      ]);
    }, 3500);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-2xl border border-night-line bg-night text-paper shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] ${className}`}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-night-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-night-raised px-3 py-1 font-mono text-[0.65rem] text-[#a8988b]">
          explorer.solana.com/address/{PROGRAM_ID.slice(0, 6)}…?cluster=devnet
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand text-on-brand">
            <Icon name="block" size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">UNSAID consent ledger</p>
            <p className="truncate font-mono text-[0.65rem] text-[#a8988b]">{PROGRAM_ID}</p>
          </div>
          <span className="ml-auto rounded-full border border-[#2f6b3a] px-2 py-0.5 text-[0.65rem] text-[#9fd3a8]">
            Executable · devnet
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ['212 B', 'per receipt'],
            ['0 B', 'of content'],
            ['~1.1 s', 'to confirm'],
          ].map(([v, l]) => (
            <div key={l} className="rounded-xl bg-night-raised px-2 py-2.5">
              <p className="font-display text-lg font-black text-brand">{v}</p>
              <p className="text-[0.6rem] text-[#a8988b]">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[0.7rem]">
            <thead className="text-[#a8988b]">
              <tr className="border-b border-night-line">
                <th className="py-2 font-medium">Signature</th>
                <th className="py-2 font-medium">Purpose</th>
                <th className="hidden py-2 font-medium min-[420px]:table-cell">Enclave</th>
                <th className="hidden py-2 font-medium sm:table-cell">Slot</th>
                <th className="py-2 text-right font-medium">Age</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((row) => (
                <tr
                  key={row.sig}
                  className={`border-b border-night-line/60 last:border-0 ${row.fresh ? 'animate-rise bg-brand/10' : ''}`}
                >
                  <td className="py-2 text-brand">{row.sig}</td>
                  <td className="py-2 font-sans">{row.purpose}</td>
                  <td className="hidden py-2 font-sans min-[420px]:table-cell">
                    {row.attested ? (
                      <span className="text-[#9fd3a8]">Attested</span>
                    ) : (
                      <span className="text-[#a8988b]">Not needed</span>
                    )}
                  </td>
                  <td className="hidden py-2 sm:table-cell">{row.slot}</td>
                  <td className="py-2 text-right text-[#a8988b]">{row.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.6rem] text-[#a8988b]">
          Example receipts, in the exact shape the program stores. No row holds a word of content.
        </p>
      </div>
    </div>
  );
}
