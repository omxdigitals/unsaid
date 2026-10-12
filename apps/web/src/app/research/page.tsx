import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { ButtonLink, Kicker, Masthead } from '@/components/editorial';
import { ResearchGrid } from '@/components/research/Research';

/**
 * The research, for anyone who wants to check the claims rather than read
 * them. Every figure is from docs/paper/benchmarks.md and each harness is a
 * script in the repository, so the numbers can be re-run and disagreed with.
 * What has not been measured is listed too — the absence is part of the result.
 */
export const metadata: Metadata = {
  title: 'Research — UNSAID',
  description:
    'Measured results for encrypted journaling with attested AI and on-chain consent receipts on Solana: zero plaintext leaks, sub-1% encryption overhead, 212-byte receipts.',
  robots: { index: true, follow: true },
};

const METHOD = [
  { k: 'Hardware', v: 'Intel Core i5-5250U, 1.6 GHz — a 2015 two-core laptop. Deliberately unflattering.' },
  { k: 'Chain', v: 'Solana devnet, program 7nRKg…BLcHZ, 100 receipts written one at a time.' },
  { k: 'Crypto', v: 'PBKDF2-SHA256 at 600,000 rounds; AES-GCM-256 per memory; AES-KW key wrap.' },
  { k: 'Harnesses', v: 'scripts/bench-client.mjs · scripts/bench-chain.mjs · canary-sweep.ts' },
];

const NOT_YET = [
  {
    what: 'Attested-inference round trip',
    why: 'Integration and gated live test are written; waiting on inference credit to run.',
  },
  { what: 'Mobile key derivation', why: 'No device harness yet. The 2015 laptop is the conservative stand-in.' },
  { what: 'Anything from real users', why: 'The pilot has not run. It is the dataset for the second paper.' },
];

const TIMELINE = [
  { when: '12 Oct 2026', what: 'Colosseum submission', done: true },
  { when: 'Late Oct 2026', what: 'arXiv preprint', done: false },
  { when: 'Feb 2027', what: 'Peer-reviewed paper, with pilot data', done: false },
];

export default function ResearchPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <Masthead
          compact
          nav={
            <nav aria-label="Primary" className="flex items-center gap-4 text-sm text-ink-soft sm:gap-6">
              <Link href="/" className="hover:text-brand-strong">
                Home
              </Link>
              <Link href="/verify" className="hover:text-brand-strong">
                Verify
              </Link>
              <ButtonLink href="/app" className="!px-4 !py-2">
                Open the app
              </ButtonLink>
            </nav>
          }
          dateline={
            <>
              <span>Research desk</span>
              <span className="hidden sm:inline">Measured 9 Oct 2026 · Re-runnable from the repository</span>
            </>
          }
        />

        <header className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Kicker>Our research</Kicker>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.25rem)] font-black leading-[1] tracking-tight text-ink">
              Privacy that is <span className="text-brand-display">measured</span>, not promised.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Every number on this page came out of a script in our repository. Each one can be
              re-run — and disagreed with.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {METHOD.map((m) => (
              <div key={m.k} className="bg-paper-raised p-4">
                <dt className="kicker !text-ink-faint">{m.k}</dt>
                <dd className="mt-1.5 text-xs leading-relaxed text-ink">{m.v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <ResearchGrid />

        <section className="grid gap-5 py-12 sm:py-16 lg:grid-cols-2">
          <div className="rounded-3xl border-2 border-dashed border-field p-7">
            <Kicker>Not measured yet</Kicker>
            <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-ink">
              What we have not shown, said plainly
            </h2>
            <ul className="mt-5 flex flex-col gap-4">
              {NOT_YET.map((n) => (
                <li key={n.what} className="flex gap-3">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-field text-ink-faint">
                    <Icon name="flask" size={11} strokeWidth={2.2} />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{n.what}</span>
                    <span className="block text-sm text-ink-soft">{n.why}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-night p-7 text-paper">
            <p className="kicker !text-brand">The paper</p>
            <h2 className="mt-3 font-display text-2xl font-black tracking-tight">
              One build, three outputs.
            </h2>
            <ol className="mt-6 flex flex-col">
              {TIMELINE.map((t, i) => (
                <li key={t.what} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < TIMELINE.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[0.6875rem] top-6 h-full w-px bg-night-line" />
                  )}
                  <span
                    className={`relative grid size-6 shrink-0 place-items-center rounded-full ${t.done ? 'bg-brand text-on-brand' : 'border border-[#6b5b50] bg-night'}`}
                  >
                    {t.done && <Icon name="check" size={12} strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block font-mono text-xs text-[#a8988b]">{t.when}</span>
                    <span className="block font-semibold">{t.what}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
