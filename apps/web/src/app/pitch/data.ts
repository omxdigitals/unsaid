import type { StatKind } from '@/components/editorial';

/**
 * Every number the deck shows, in one place, with where it came from.
 *
 * `measured` figures are from docs/paper/benchmarks.md and can be re-run from
 * the scripts it names. `expected` and `projected` are labelled as such on
 * screen — a judge who checks the repository should find exactly what the
 * slide said. `survey` figures are third-party research.
 */
export type Stat = { value: string; label: string; source: string; kind: StatKind };

export const STATS = {
  sensitive: {
    value: '82%',
    label: 'of chatbot users rate their AI conversations as sensitive or highly sensitive',
    source: 'Stanford, Oct 2025',
    kind: 'survey',
  },
  ghibli: {
    value: '700M',
    label: 'images made by 130M people in the first week of ChatGPT image generation',
    source: 'OpenAI COO, Apr 2025',
    kind: 'survey',
  },
  agree: {
    value: '56%',
    label: 'of Americans click “agree” on privacy policies without reading them',
    source: 'Pew Research, Oct 2023',
    kind: 'survey',
  },
  leaks: {
    value: '0',
    label: 'secret markers found in our whole database, 806 stored objects and every log',
    source: 'Canary sweep, n=30',
    kind: 'measured',
  },
  saveShare: {
    value: '<1%',
    label: 'of save time is encryption — 1.6 ms of 171 ms',
    source: 'End-to-end save, n=30',
    kind: 'measured',
  },
  unlock: {
    value: '0.4s',
    label: 'to unlock a vault on a 2015 laptop — phones are faster',
    source: 'PBKDF2, 600k rounds, n=20',
    kind: 'measured',
  },
  receipts: {
    value: '98/100',
    label: 'on-chain receipts confirmed on a free devnet RPC, median 1.1 s',
    source: 'Solana devnet, n=100',
    kind: 'measured',
  },
  overhead: {
    value: '+218 B',
    label: 'per memory, flat — a sentence or a 10 MB voice note',
    source: 'AES-GCM envelope',
    kind: 'measured',
  },
  enclave: {
    value: '2–5%',
    label: 'slowdown for AI running inside a confidential GPU enclave',
    source: 'NVIDIA Confidential Computing',
    kind: 'expected',
  },
  receiptBytes: {
    value: '17%',
    label: 'of one Solana transaction: a 212-byte receipt with no content in it',
    source: 'Program account layout',
    kind: 'measured',
  },
  batching: {
    value: '~20×',
    label: 'cheaper receipts by batching each period into one Merkle root',
    source: 'benchmarks.md §5',
    kind: 'projected',
  },
} satisfies Record<string, Stat>;

/** Per-user monthly chain cost at 20 reflections, today vs batched. */
export const UNIT_COST = {
  today: { usd: 2.56, label: 'One account per receipt (today)', kind: 'measured' as StatKind },
  batched: { usd: 0.13, label: 'Merkle-batched (next)', kind: 'projected' as StatKind },
  price: 8,
};

/**
 * The ask. Left for the team to fill in — the deck renders whatever is here,
 * and an invented figure on a funding slide is worse than an honest blank.
 */
export const FUNDING = {
  amount: '$___K',
  split: [
    { label: 'Confidential GPU inference', share: 35 },
    { label: 'Mainnet, RPC & receipts', share: 20 },
    { label: 'Security audit', share: 25 },
    { label: 'Pilot & first launches', share: 20 },
  ],
};

export const LIVE_URL = 'unsaid-vault.vercel.app';
