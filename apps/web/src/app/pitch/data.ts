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
 * The ask: six months to a mainnet pilot, built bottom-up from this project's
 * real cost drivers. Every line is an estimate, not a quote — check them
 * before you say the number on camera. Receipt cost uses the measured 0.0017
 * SOL per receipt (docs/paper/benchmarks.md §5) at the 22 Jun 2026 SOL quote.
 */
export const FUNDING_LINES = [
  { label: 'Team runway', usd: 22_500, basis: '3 people × $1,250/mo × 6 months' },
  { label: 'Security audit', usd: 25_000, basis: 'Anchor program + client crypto review before real users' },
  { label: 'Confidential GPU inference', usd: 12_000, basis: 'Dedicated TDX + NVIDIA CC instance, ~$2/h × 6 months' },
  { label: 'Pilot & launch', usd: 6_000, basis: 'User research, first 1,000 users, launch' },
  { label: 'Mainnet, RPC & receipts', usd: 5_000, basis: 'Paid RPC ~$500/mo + batched receipt rent for 1,000 users' },
  { label: 'Hosting', usd: 2_000, basis: 'App, API, Postgres, object storage ~$300/mo' },
];

const FUNDING_TOTAL = FUNDING_LINES.reduce((n, l) => n + l.usd, 0);

export const FUNDING = {
  amount: `$${FUNDING_TOTAL / 1000}K`,
  runway: '6 months to a mainnet pilot',
  split: FUNDING_LINES.map((l) => ({ label: l.label, share: Math.round((l.usd / FUNDING_TOTAL) * 100) })),
};

export const LIVE_URL = 'unsaid-vault.vercel.app';

/** Team — Colosseum lists leaving the team out as a common mistake. */
export const TEAM: { name: string; role: string; background?: string }[] = [
  { name: 'Siddanta Sodari', role: 'Full Stack Developer' },
  { name: 'Rabin Poudel', role: 'Designer' },
  { name: 'Sachin Rijal', role: 'Backend Developer' },
];

/**
 * User feedback or validation, "even if informal" (Colosseum workshop). Real
 * quotes and real numbers only: a fabricated quote on a traction slide is the
 * fastest way to lose a judge who checks.
 */
export const VALIDATION = {
  /** Where the community follows the build. */
  links: [{ label: 'x.com/unsaid_privacy', href: 'https://x.com/unsaid_privacy' }],
  /** Leave '' to hide; fill with real counts only. */
  waitlist: '',
  conversations: '',
  quotes: [] as { quote: string; who: string }[],
};

/** Target length of the pitch video. Colosseum's limit is three minutes. */
export const PITCH_SECONDS = 180;
