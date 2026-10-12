'use client';

import { Icon, type IconName } from '@/components/Icon';
import { PhalaFlow } from '@/components/scenes/PhalaFlow';
import { ChainStream } from '@/components/scenes/Loops';
import { PROGRAM_ID } from '@/lib/chain';
import { Beat, H, K, type Slide } from './slides';

/**
 * The technical demo video (Colosseum: 2–3 minutes, "the how, not another
 * pitch"): core features, stack, why we chose what we chose, and exactly how
 * Solana is used. Every claim points at a file in the repository.
 */

function Code({ children }: { children: string }) {
  return <code className="rounded bg-paper-tint px-1.5 py-0.5 font-mono text-[0.85em] text-ink">{children}</code>;
}

function Box({
  icon,
  title,
  sub,
  tone = 'paper',
}: {
  icon: IconName;
  title: string;
  sub: string;
  tone?: 'paper' | 'brand' | 'night';
}) {
  const cls =
    tone === 'brand'
      ? 'border-brand bg-brand text-on-brand'
      : tone === 'night'
        ? 'border-night bg-night text-paper'
        : 'border-line bg-paper-raised text-ink';
  return (
    <div className={`flex flex-col gap-2 rounded-2xl border-2 p-4 ${cls}`}>
      <Icon name={icon} size={24} strokeWidth={1.9} />
      <p className="font-display text-lg font-bold leading-tight">{title}</p>
      <p className={`text-xs leading-snug ${tone === 'paper' ? 'text-ink-soft' : 'opacity-85'}`}>{sub}</p>
    </div>
  );
}

export const TECH: Slide[] = [
  /* 1 · What we built */
  {
    section: 'Overview',
    seconds: 15,
    builds: 1,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <K>Technical demo · the how</K>
          <H>
            An encrypted journal, a sealed AI, and <span className="text-brand-display">a ledger on Solana.</span>
          </H>
        </div>
        <Beat at={1} b={b} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['lock', 'Client-side vault', 'Keys derived and memories sealed in the browser'],
            ['cpu', 'Attested reflection', 'Echo runs in a TEE that signs what code ran'],
            ['block', 'Consent receipts', 'An Anchor program records every access, content-free'],
            ['search', 'Public verifier', 'Anyone checks a record against Solana, not us'],
          ].map(([i, t, d]) => (
            <Box key={t} icon={i as IconName} title={t!} sub={d!} />
          ))}
        </Beat>
      </div>
    ),
    notes: <>Four core features, each one shown in the slides that follow.</>,
  },

  /* 2 · Architecture */
  {
    section: 'Architecture',
    seconds: 25,
    builds: 2,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>Architecture · who sees what</K>
          <H>Plaintext exists in two places only.</H>
        </div>
        <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <Box icon="phone" title="Browser" sub="Next.js 16 · WebCrypto: PBKDF2 → AES-256-GCM. Plaintext lives here." tone="brand" />
          <span className="hidden self-center text-ink-faint lg:block">
            <Icon name="arrowRight" size={22} />
          </span>
          <div className="grid gap-3">
            <Box icon="server" title="API" sub="Fastify + Zod · auth, quotas, consent checks. Ciphertext only." />
            <Box icon="database" title="Postgres + object storage" sub="Drizzle schema with no content column · S3/MinIO holds ciphertext." />
          </div>
          <span className="hidden self-center text-ink-faint lg:block">
            <Icon name="arrowRight" size={22} />
          </span>
          <div className="grid gap-3">
            <Beat at={1} b={b}>
              <Box icon="cpu" title="Phala enclave" sub="Intel TDX + NVIDIA CC. The second place plaintext exists — inside the chip, for one reply." tone="night" />
            </Beat>
            <Beat at={2} b={b}>
              <Box icon="block" title="Solana" sub={`Anchor program ${PROGRAM_ID.slice(0, 6)}… · receipts the API cannot edit`} tone="night" />
            </Beat>
          </div>
        </div>
        <p className="text-sm text-ink-faint">
          Monorepo: <Code>apps/web</Code> · <Code>backend/api</Code> · <Code>packages/crypto</Code> ·{' '}
          <Code>packages/solana</Code> · <Code>programs/unsaid</Code> (Rust, Anchor 0.31.1)
        </p>
      </div>
    ),
    notes: <>Walk left to right. The point to land: the server column never holds anything readable.</>,
  },

  /* 3 · Encryption */
  {
    section: 'Encryption',
    seconds: 20,
    builds: 1,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>Encryption · packages/crypto</K>
          <H>
            One key per memory, <span className="text-brand-display">wrapped by yours.</span>
          </H>
        </div>
        <ol className="grid gap-3 lg:grid-cols-4">
          {[
            ['Your phrase', 'PBKDF2-SHA256 · 600,000 rounds (OWASP floor) → vault key. 0.4 s on a 2015 laptop.'],
            ['Per memory', 'A fresh AES-256-GCM content key and 96-bit IV for every memory.'],
            ['Wrapped', 'The content key is wrapped with AES-KW under the vault key; only the wrap is stored.'],
            ['Stored', '+218 bytes of envelope, flat. Forgetting destroys the key, so backups become noise.'],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-line bg-paper-raised p-4">
              <span className="font-mono text-xs text-brand-strong">0{i + 1}</span>
              <p className="mt-1 font-display text-lg font-bold">{t}</p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
        <Beat at={1} b={b}>
          <p className="text-sm text-ink-soft">
            Demo: open <Code>/privacy</Code> and press Encrypt — the real <Code>sealText()</Code> runs on your
            sentence and reports its own milliseconds. Source: <Code>packages/crypto/src/envelope.ts</Code>.
          </p>
        </Beat>
      </div>
    ),
    notes: <>Show the live encrypt box here — this is the moment to cut to the browser.</>,
  },

  /* 4 · Echo in the enclave */
  {
    section: 'Private AI',
    seconds: 25,
    builds: 5,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>Echo · backend/api/src/lib/ai/phala.ts</K>
          <H>
            Attest first, <span className="text-brand-display">then send.</span>
          </H>
        </div>
        <PhalaFlow step={b} />
        <p className="text-sm text-ink-faint">
          The measurement is read before the call. If the enclave cannot be attested, the access is recorded as
          unattested — the program stores that as a distinct kind of event, never silently the same.
        </p>
      </div>
    ),
    notes: (
      <>
        Integration and a gated live test are written; the live round trip is waiting on inference
        credit. Say so if asked — the architecture is what this slide shows.
      </>
    ),
  },

  /* 5 · The Solana program */
  {
    section: 'Solana',
    seconds: 30,
    builds: 2,
    render: (b) => (
      <div className="grid flex-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <div>
            <K>On-chain · programs/unsaid (Anchor)</K>
            <H className="!text-[clamp(1.8rem,min(3.6vw,6vh),3rem)]">What the chain holds, byte for byte.</H>
          </div>
          <div className="overflow-hidden rounded-2xl border-2 border-ink font-mono text-xs">
            <div className="bg-ink px-3 py-2 text-paper">ConsentReceipt · PDA [&quot;consent&quot;, subject, receipt_id] · 212 B</div>
            {[
              ['discriminator', '8', 'Anchor account type'],
              ['recorder', '32', 'who wrote it'],
              ['receipt_id', '32', ''],
              ['subject', '32', 'digest of the vault — never a wallet'],
              ['thought_id', '32', 'domain-separated digest'],
              ['attestation', '32', 'enclave measurement'],
              ['result_hash', '32', 'hash of the reply'],
              ['consent_version · purpose · created_at · bump', '12', ''],
            ].map(([f, n, d]) => (
              <div key={f} className="grid grid-cols-[1fr_auto] gap-2 border-t border-line px-3 py-1.5">
                <span>
                  {f} <span className="text-ink-faint">{d}</span>
                </span>
                <span className="text-brand-strong">{n}</span>
              </div>
            ))}
          </div>
          <Beat at={1} b={b}>
            <p className="text-sm text-ink-soft">
              Instructions: <Code>create_record</Code> <Code>update_record</Code> <Code>revoke_record</Code>{' '}
              <Code>close_record</Code> <Code>record_consent</Code>. No field is content, so nothing grows with
              what a user writes — 17% of one transaction, 0.0017 SOL, confirmed in ~1.1 s on devnet.
            </p>
          </Beat>
        </div>
        <Beat at={2} b={b}>
          <ChainStream />
        </Beat>
      </div>
    ),
    notes: <>This is the &ldquo;how we use Solana&rdquo; slide Colosseum asks for. Name the PDA seeds and the fields.</>,
  },

  /* 6 · Verify without us */
  {
    section: 'Verifier',
    seconds: 15,
    builds: 0,
    render: () => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>Verify · apps/web/src/app/verify</K>
          <H>
            Our servers are <span className="text-brand-display">not in the path.</span>
          </H>
        </div>
        <ol className="grid gap-3 md:grid-cols-4">
          {[
            ['Paste', 'owner address + memory id (+ optional ciphertext hash)'],
            ['Derive', 'the PDA in the browser, with @solana/kit'],
            ['Read', 'the account straight from a public Solana RPC'],
            ['Compare', 'the on-chain commitment to the hash you supplied'],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-line bg-paper-raised p-4">
              <span className="grid size-8 place-items-center rounded-full bg-brand font-display font-black text-on-brand">{i + 1}</span>
              <p className="mt-3 font-display text-lg font-bold">{t}</p>
              <p className="mt-1 text-sm text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
        <p className="text-ink-soft">If our API were lying, this page would still tell the truth — that is why the record is on a chain at all.</p>
      </div>
    ),
    notes: <>Cut to /verify and show a VERIFIED stamp.</>,
  },

  /* 7 · Decisions */
  {
    section: 'Decisions',
    seconds: 25,
    builds: 3,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>Decisions · docs/decisions.md</K>
          <H>What we chose, and what we turned down.</H>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['TEE, not FHE', 'FHE on transformers is minutes per token, and fixed-shape circuits cannot take free-length text. Attestation is the only option deployable at LLM scale today.'],
            ['Receipts per access, then batching', 'One account per receipt is the simplest thing a stranger can verify. It costs ~$2.56/user/month at 20 reflections; Merkle batching (~20× cheaper) is next.'],
            ['No previews, by schema', 'There is no title, body or tag column — and CI fails the build if one is ever added, or if a log line mentions content.'],
            ['Search on the client', 'A personal vault is small enough to decrypt and match in memory, which leaks nothing — unlike searchable encryption schemes.'],
          ].map(([t, d], i) => (
            <Beat key={t} at={i} b={b} className="rounded-2xl border border-line bg-paper-raised p-5">
              <p className="font-display text-xl font-bold">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d}</p>
            </Beat>
          ))}
        </div>
      </div>
    ),
    notes: <>Colosseum asks for the decisions behind prioritising components. These four are the honest answer.</>,
  },

  /* 8 · Quality and next */
  {
    section: 'Quality',
    seconds: 15,
    builds: 0,
    render: () => (
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div>
          <K>Quality · and what is next</K>
          <H>
            Tested like the claim <span className="text-brand-display">depends on it.</span>
          </H>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['240', 'automated tests across crypto, API, program client and web'],
            ['0', 'secrets found by the canary sweep across DB, storage and logs'],
            ['CI', 'secret scan · no content columns · no content in logs · dependency audit'],
          ].map(([v, l]) => (
            <div key={l} className="border-t-[3px] border-rule pt-3">
              <p className="font-display text-5xl font-black text-brand-display">{v}</p>
              <p className="mt-1 text-sm text-ink">{l}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-soft">
          Next: live attested inference, Merkle-batched receipts, mainnet. Research: <Code>/research</Code> · paper
          notes in <Code>docs/paper</Code>.
        </p>
      </div>
    ),
    notes: <>End on the repo and the research page so judges know where to look.</>,
  },
];
