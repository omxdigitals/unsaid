'use client';

import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';
import { LiveSeal } from '@/components/LiveSeal';
import { Marker, StatFigure, type StatKind } from '@/components/editorial';
import { PhalaFlow } from '@/components/scenes/PhalaFlow';
import { LockIcon, SealLoop } from '@/components/scenes/SealLoop';
import { FUNDING, LIVE_URL, STATS, UNIT_COST, type Stat } from './data';
import { GhibliUpload, PlaintextLeak, PolicyScroll } from './scenes';
import { ChainStream, CountUp, DualPipeline } from '@/components/scenes/Loops';
import { CanarySweep, PriorArt, ReceiptLatency, SaveBreakdown } from '@/components/research/Research';

export type Slide = {
  section: string;
  /** Beats after the slide's first frame. 0 means the slide is one frame. */
  builds: number;
  render: (build: number) => ReactNode;
  notes: ReactNode;
};

/* ---------- small building blocks ---------- */

/** Reserves its space from the start, so a beat appearing never shoves the slide. */
function Beat({
  at,
  b,
  children,
  className = '',
}: {
  at: number;
  b: number;
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${b >= at ? 'animate-rise' : 'invisible'} ${className}`}>{children}</div>;
}

function H({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display text-[clamp(2rem,min(5.2vw,8.5vh),4.25rem)] font-black leading-[1.02] tracking-tight text-ink ${className}`}
    >
      {children}
    </h2>
  );
}

function K({ children }: { children: ReactNode }) {
  return <p className="kicker mb-3">{children}</p>;
}

function S({ stat, className = "" }: { stat: Stat; className?: string }) {
  return (
    <StatFigure
      value={<CountUp value={stat.value} />}
      label={stat.label}
      source={stat.source}
      kind={stat.kind}
      className={className}
    />
  );
}

function Pill({ kind }: { kind: StatKind }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.14em] ${
        kind === 'measured' ? 'border-safe text-safe' : 'border-dashed border-ink-faint text-ink-faint'
      }`}
    >
      {kind}
    </span>
  );
}

/* ---------- the deck ---------- */

export const SLIDES: Slide[] = [
  /* 1 · Cover */
  {
    section: 'Front page',
    builds: 2,
    render: (b) => (
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="border-y-[3px] border-rule py-2 text-center">
            <p className="font-masthead text-[clamp(1.4rem,3.4vw,2.6rem)] font-black uppercase tracking-[0.04em]">
              The Unsaid Times
            </p>
            <p className="kicker !text-ink-faint">Vol. 1 · Encrypted edition · Colosseum 2026</p>
          </div>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,min(7vw,13vh),6.5rem)] font-black leading-[0.98] tracking-tight">
            Not every thought needs an{' '}
            <span className="text-brand-display">
              <Marker>audience.</Marker>
            </span>
          </h1>
          <Beat at={1} b={b}>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft sm:text-2xl">
              A private journal with an AI that{' '}
              <strong className="text-ink">can&rsquo;t read your secrets</strong> — and receipts
              that prove it.
            </p>
          </Beat>
        </div>
        <Beat at={2} b={b}>
          <SealLoop />
          <p className="mt-3 text-xs text-ink-faint">
            Write · seal on your phone · we store noise · only you read it back
          </p>
        </Beat>
      </div>
    ),
    notes: (
      <>
        One breath: &ldquo;UNSAID is a private journal where an AI can reflect on what you wrote
        without anyone — including us — being able to read it, and every access leaves a public
        receipt.&rdquo; Let the loop play once before clicking on.
      </>
    ),
  },

  /* 2 · Problem: plain text */
  {
    section: 'The problem',
    builds: 8,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>The problem</K>
          <H>
            The internet stores your secrets in <Marker>plain text.</Marker>
          </H>
        </div>
        {b < 5 ? (
          <PlaintextLeak watchers={b} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <GhibliUpload step={Math.min(b - 4, 3)} />
            <div className="flex flex-col justify-center gap-8">
              <S stat={STATS.ghibli} />
              <Beat at={8} b={b}>
                <S stat={STATS.sensitive} />
              </Beat>
            </div>
          </div>
        )}
      </div>
    ),
    notes: (
      <>
        Beats 1–4: type a real-sounding sentence; each click adds who can read that row.
        Beats 5–7: the Ghibli moment — 130M people uploaded their faces in one week; in the
        consumer app, &ldquo;improve the model for everyone&rdquo; is on unless you turn it off,
        so the photo can become training data. Beat 8: 82% say these chats are sensitive. Sensitive data, weakest protection.
      </>
    ),
  },

  /* 3 · Privacy policy */
  {
    section: 'The illusion',
    builds: 3,
    render: (b) => (
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <K>&ldquo;Just read our privacy policy&rdquo;</K>
          <H>
            People are worried. All they can do is <Marker>click agree.</Marker>
          </H>
          <Beat at={2} b={b} className="mt-8">
            <S stat={STATS.agree} />
          </Beat>
          <Beat at={3} b={b} className="mt-8">
            <p className="font-display text-3xl font-bold leading-tight text-brand-strong sm:text-4xl">
              A policy is a promise.
              <br />
              You can&rsquo;t verify a promise.
            </p>
          </Beat>
        </div>
        <PolicyScroll highlight={b >= 1} agreed={b >= 2} />
      </div>
    ),
    notes: (
      <>
        Don&rsquo;t accuse anyone of lying — the point is stronger: even an honest policy is
        unverifiable, and it can change tomorrow. Beat 1 highlights the clauses that matter.
      </>
    ),
  },

  /* 4 · Enter Unsaid */
  {
    section: 'Our answer',
    builds: 4,
    render: (b) => (
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div>
          <K>Enter UNSAID · Privacy by design</K>
          <p className="font-display text-4xl font-black text-ink-faint line-through decoration-ember decoration-4 sm:text-6xl">
            &ldquo;Trust us.&rdquo;
          </p>
          <Beat at={1} b={b}>
            <p className="mt-2 font-display text-5xl font-black tracking-tight text-ink sm:text-7xl">
              Don&rsquo;t trust us. <span className="text-brand-display">Check us.</span>
            </p>
          </Beat>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: 'lock' as IconName, t: 'Encrypted on your phone', d: 'Before anything leaves it. We hold noise.' },
            { icon: 'cpu' as IconName, t: 'AI in a sealed chip', d: 'Reflection runs inside a hardware enclave that signs what it ran.' },
            { icon: 'chain' as IconName, t: 'A receipt for every access', d: 'Content-free, on Solana. Anyone can check it.' },
          ].map((p, i) => (
            <Beat key={p.t} at={i + 2} b={b}>
              <div className="h-full rounded-2xl border-2 border-brand bg-paper-tint p-6">
                <span className="grid size-12 place-items-center rounded-full bg-brand text-on-brand">
                  <Icon name={p.icon} size={24} />
                </span>
                <p className="mt-4 font-display text-2xl font-bold text-ink">{p.t}</p>
                <p className="mt-2 text-ink-soft">{p.d}</p>
              </div>
            </Beat>
          ))}
        </div>
      </div>
    ),
    notes: <>Three pillars, one per click. Everything after this slide is evidence for these three.</>,
  },

  /* 4b · Same sentence, two worlds */
  {
    section: 'The difference',
    builds: 0,
    render: () => (
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <K>The same sentence, two worlds</K>
          <H>
            Where your words end up <span className="text-brand-display">is a design choice.</span>
          </H>
        </div>
        <DualPipeline />
      </div>
    ),
    notes: <>This one loops by itself. Point left, then right. Left ends in a training set; right ends as noise plus a public receipt.</>,
  },

  /* 5 · Live demo */
  {
    section: 'Live',
    builds: 1,
    render: (b) => (
      <div className="grid flex-1 items-start gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <K>Live · in this browser · real encryption</K>
          <H>Your words. Our view.</H>
          <p className="mt-6 text-lg text-ink-soft">
            Ask the room for a sentence. This is the same code a vault runs — AES-256-GCM, keys
            from 600,000 rounds of PBKDF2, timed on this machine.
          </p>
          <Beat at={1} b={b} className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl border-2 border-caution bg-caution-wash p-4">
              <p className="kicker !text-caution">What you see</p>
              <p className="mt-2 font-serif text-lg">Your sentence</p>
            </div>
            <div className="rounded-xl border-2 border-safe bg-safe-wash p-4">
              <p className="kicker !text-safe">What we see</p>
              <p className="mt-2 font-mono text-sm">x9Kq…Zt_4 +218 B</p>
            </div>
          </Beat>
        </div>
        <div data-interactive>
          <LiveSeal />
        </div>
      </div>
    ),
    notes: (
      <>
        Click into the box (typing won&rsquo;t flip slides), take a sentence from a judge, press
        Encrypt. Point at the milliseconds: measured on this laptop, now. No network request.
      </>
    ),
  },

  /* 6 · Echo + Phala */
  {
    section: 'Private AI',
    builds: 5,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>How Echo reflects without leaking · Phala confidential AI</K>
          <H>
            Feedback from AI. <span className="text-brand-display">Nothing leaks.</span>
          </H>
        </div>
        <PhalaFlow step={b} />
        <p className="text-xs text-ink-faint">
          OpenAI-compatible confidential inference · attestation report published at a public URL ·
          architecture of <span className="font-mono">backend/api/src/lib/ai/phala.ts</span>
        </p>
      </div>
    ),
    notes: (
      <>
        One click per hop. Be precise: the memory is readable inside the enclave — a model cannot
        reflect on what it cannot read — but nobody outside the chip can see it, and the hardware
        signs which code ran. That signature goes on the receipt. If asked: the integration is
        built and tested; the live round trip is waiting on inference credit, which is part of
        the ask.
      </>
    ),
  },

  /* 7 · Blockchain, only where it earns its place */
  {
    section: 'Why Solana',
    builds: 3,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <K>Privacy on the blockchain · used sparingly</K>
          <H>
            On chain: <span className="text-brand-display">proof.</span> Never: your words.
          </H>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-display text-xl font-bold">One receipt in one Solana transaction</p>
              <div className="mt-3 h-10 overflow-hidden rounded-lg border-2 border-ink">
                <div
                  className="flex h-full items-center bg-brand px-3 font-mono text-xs text-on-brand transition-[width] duration-1000"
                  style={{ width: b >= 1 ? '17.2%' : '0%' }}
                >
                  212 B
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-ink-faint">
                <span>consent v · enclave hash · reply hash · time</span>
                <span>1,232 B limit</span>
              </div>
            </div>
            <Beat at={2} b={b}>
              <p className="font-display text-xl font-bold">Never written to the chain</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {['your words', 'your photos & voice', 'who you are', 'your wallet, by default'].map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1.5 text-ink-faint line-through decoration-ember decoration-2"
                  >
                    <Icon name="x" size={13} strokeWidth={2.4} className="text-ember" />
                    {t}
                  </li>
                ))}
              </ul>
            </Beat>
            <Beat at={3} b={b} className="grid gap-6 sm:grid-cols-2">
              <S stat={STATS.receipts} />
              <S stat={STATS.batching} />
            </Beat>
          </div>
          <ChainStream />
        </div>
      </div>
    ),
    notes: (
      <>
        The block stream runs on its own — let it loop while you talk. Chain is the one part we
        cannot edit after the fact; that&rsquo;s why it&rsquo;s there. A stranger can verify a
        receipt at /verify with none of our servers involved.
      </>
    ),
  },

  /* 8 · Results */
  {
    section: 'Results',
    builds: 6,
    render: (b) => {
      const tiles: Stat[] = [
        STATS.leaks,
        STATS.saveShare,
        STATS.unlock,
        STATS.receipts,
        STATS.enclave,
        STATS.overhead,
      ];
      return (
        <div className="flex flex-1 flex-col gap-8">
          <div>
            <K>The research · in plain words</K>
            <H>
              Private <span className="text-brand-display">and</span> fast.
            </H>
          </div>
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((t, i) => (
              <Beat key={t.label} at={i + 1} b={b} className="border-t-[3px] border-rule pt-4">
                <S stat={t} />
              </Beat>
            ))}
          </div>
          <Beat at={6} b={b}>
            <p className="font-display text-2xl font-bold text-brand-strong sm:text-3xl">
              Privacy is not what makes it slow.
            </p>
          </Beat>
        </div>
      );
    },
    notes: (
      <>
        Every &ldquo;measured&rdquo; tile is re-runnable from scripts in the repo
        (docs/paper/benchmarks.md). The enclave figure is labelled expected — it is NVIDIA&rsquo;s
        published overhead for confidential computing.
      </>
    ),
  },

  /* 8b · Research */
  {
    section: 'Research',
    builds: 3,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <K>Our research · re-runnable from the repo</K>
          <H>
            We tried to make it leak. <span className="text-brand-display">It didn&rsquo;t.</span>
          </H>
        </div>
        {b < 3 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="flex">
              <CanarySweep />
            </div>
            <Beat at={1} b={b} className="flex">
              <SaveBreakdown />
            </Beat>
            <Beat at={2} b={b} className="flex">
              <ReceiptLatency />
            </Beat>
          </div>
        ) : (
          <div className="animate-rise">
            <PriorArt />
          </div>
        )}
      </div>
    ),
    notes: (
      <>
        Canary sweep first: 30 marked secrets, then a search of the whole database dump, every
        stored object and every log line — zero hits, with a control that proves the search
        works. Then cost of privacy (under 1%), then the chain. Last beat: the prior-art table is
        the research contribution in one picture.
      </>
    ),
  },

  /* 9 · Market gap */
  {
    section: 'The gap',
    builds: 2,
    render: (b) => (
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <K>The gap in the market</K>
          <H>
            Helpful AI <span className="text-ink-faint">or</span> private.{' '}
            <span className="text-brand-display">Until now.</span>
          </H>
          <Beat at={2} b={b} className="mt-8">
            <p className="text-xl text-ink-soft">Our customers, ring by ring:</p>
            <div className="mt-4 flex flex-col gap-2">
              {[
                'People who already care about privacy',
                'Journalers, people in therapy, people going through something',
                'Anyone who has hesitated before typing something into an AI',
              ].map((t, i) => (
                <p key={t} className="flex items-center gap-3 text-lg">
                  <span
                    className="grid shrink-0 place-items-center rounded-full border-2 border-brand font-display font-black text-brand-strong"
                    style={{ width: 28 + i * 8, height: 28 + i * 8 }}
                  >
                    {i + 1}
                  </span>
                  {t}
                </p>
              ))}
            </div>
          </Beat>
        </div>
        <Quadrant showUs={b >= 1} />
      </div>
    ),
    notes: <>Top-right is empty. Chatbots are helpful but unverifiable; encrypted notes are private but have no AI.</>,
  },

  /* 10 · Giants */
  {
    section: 'Competition',
    builds: 2,
    render: (b) => (
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div>
          <K>How we beat the giants</K>
          <H>
            They can&rsquo;t copy this without{' '}
            <Marker>breaking their business model.</Marker>
          </H>
        </div>
        <Beat at={1} b={b} className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-line p-6">
            <p className="kicker !text-ink-faint">Them</p>
            <p className="mt-2 font-display text-2xl font-bold">Your data makes their AI better.</p>
            <p className="mt-2 text-ink-soft">Reading it is the product.</p>
          </div>
          <div className="rounded-2xl border-2 border-brand bg-paper-tint p-6">
            <p className="kicker">Us</p>
            <p className="mt-2 font-display text-2xl font-bold">We built it so we can&rsquo;t read it.</p>
            <p className="mt-2 text-ink-soft">Not-reading is the product.</p>
          </div>
        </Beat>
        <Beat at={2} b={b} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['search', 'Verifiable', 'anyone can audit a receipt'],
            ['chain', 'Open record', 'on a chain nobody owns'],
            ['handshake', 'Earned trust', 'one receipt at a time'],
            ['coins', 'Lean', 'no readable data to guard'],
          ].map(([i, t, d]) => (
            <div key={t} className="border-t-[3px] border-rule pt-3">
              <span className="text-brand-strong">
                <Icon name={i as IconName} size={28} />
              </span>
              <p className="mt-2 font-display text-xl font-bold">{t}</p>
              <p className="text-sm text-ink-soft">{d}</p>
            </div>
          ))}
        </Beat>
      </div>
    ),
    notes: <>Our moat is verifiability. A giant can promise privacy; it cannot easily make a promise checkable without giving up what its AI learns from.</>,
  },

  /* 11 · Business model */
  {
    section: 'Business',
    builds: 2,
    render: (b) => (
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <K>Business model</K>
          <H>
            Free to keep. <span className="text-brand-display">Pay to reflect.</span>
          </H>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-line bg-paper-raised p-6">
            <p className="kicker !text-ink-faint">Free</p>
            <p className="mt-2 font-display text-5xl font-black">$0</p>
            <p className="mt-3 text-ink-soft">Unlimited encrypted vault · export everything · forget for real</p>
          </div>
          <Beat at={1} b={b}>
            <div className="h-full rounded-2xl border-2 border-brand bg-brand p-6 text-on-brand">
              <p className="kicker !text-on-brand">Plus · paid in USDC</p>
              <p className="mt-2 font-display text-5xl font-black">~${UNIT_COST.price}/mo</p>
              <p className="mt-3">Echo reflections in a sealed enclave · a public receipt for every access</p>
            </div>
          </Beat>
        </div>
        <Beat at={2} b={b}>
          <p className="font-display text-xl font-bold">Chain cost per Plus user, per month (20 reflections)</p>
          <div className="mt-4 flex flex-col gap-3">
            {[UNIT_COST.today, UNIT_COST.batched].map((c) => (
              <div key={c.label} className="grid grid-cols-[minmax(0,12rem)_1fr] items-center gap-3">
                <span className="flex flex-col gap-1 text-sm">
                  {c.label} <Pill kind={c.kind} />
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-7 rounded-md bg-brand transition-[width] duration-1000"
                    style={{ width: `${Math.max((c.usd / UNIT_COST.price) * 100, 1.5)}%` }}
                  />
                  <span className="font-mono text-sm">${c.usd.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink-faint">Bar length is the share of an ${UNIT_COST.price} subscription.</p>
        </Beat>
      </div>
    ),
    notes: (
      <>
        Say it before a judge does: per-receipt accounts cost about a third of the subscription
        today. Merkle batching (one root per period) is the fix — projected ~20× cheaper, and it
        keeps each receipt individually provable.
      </>
    ),
  },

  /* 12 · Challenges + ask */
  {
    section: 'The ask',
    builds: 2,
    render: (b) => (
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <K>Our challenges, said plainly</K>
          <H>
            The tech works. <span className="text-brand-display">The runway doesn&rsquo;t — yet.</span>
          </H>
          <div className="mt-8 flex flex-col gap-4">
            <Beat at={1} b={b} className="flex gap-4">
              <span className="text-brand-strong"><Icon name="coins" size={28} /></span>
              <p className="text-lg">
                <strong className="font-display">Funding.</strong> Confidential GPU inference and
                mainnet costs money from the first user.
              </p>
            </Beat>
            <Beat at={1} b={b} className="flex gap-4">
              <span className="text-brand-strong"><Icon name="flask" size={28} /></span>
              <p className="text-lg">
                <strong className="font-display">Research.</strong> Scaling attested AI and
                batched receipts to millions of users.
              </p>
            </Beat>
          </div>
        </div>
        <Beat at={2} b={b} className="flex flex-col items-center gap-6">
          <Donut />
          <p className="font-display text-5xl font-black text-brand-display">{FUNDING.amount}</p>
          <p className="text-ink-soft">to reach a public launch</p>
        </Beat>
      </div>
    ),
    notes: <>Fill in FUNDING in app/pitch/data.ts before presenting.</>,
  },

  /* 13 · Roadmap */
  {
    section: 'Roadmap',
    builds: 4,
    render: (b) => {
      const stops = [
        { when: 'Now', what: 'Working product on devnet · public verifier · 220+ tests' },
        { when: 'Next', what: 'Funding · live attested AI · batched receipts · pilot users' },
        { when: 'Then', what: 'Mainnet · mobile apps · hardening for scale' },
        { when: 'Global', what: 'Launch worldwide, in every language people keep secrets in' },
      ];
      return (
        <div className="flex flex-1 flex-col gap-10">
          <div>
            <K>Roadmap</K>
            <H>From devnet to the world.</H>
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-1 bg-line" />
            <div
              className="absolute left-0 top-5 h-1 bg-brand transition-[width] duration-700"
              style={{ width: `${(b / stops.length) * 100}%` }}
            />
            <ol className="relative grid gap-6 sm:grid-cols-4">
              {stops.map((s, i) => (
                <li key={s.when} className={b > i ? 'animate-rise' : 'opacity-30'}>
                  <span
                    className={`grid size-11 place-items-center rounded-full border-4 border-paper font-display font-black ${
                      b > i ? 'bg-brand text-on-brand' : 'bg-line text-ink-faint'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className="mt-4 font-display text-3xl font-black">{s.when}</p>
                  <p className="mt-2 text-ink-soft">{s.what}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      );
    },
    notes: <>One stop per click.</>,
  },

  /* 14 · Why invest */
  {
    section: 'Why now',
    builds: 3,
    render: (b) => (
      <div className="flex flex-1 flex-col justify-center gap-10">
        <div>
          <K>Why invest</K>
          <H>
            Everyone is talking to AI. <Marker>Nobody can check where it goes.</Marker>
          </H>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { n: '01', t: 'The timing', d: 'AI is now where people bring their most personal questions — and 82% already know it is sensitive.' },
            { n: '02', t: 'It already works', d: 'Deployed on Solana devnet, a public verifier, a privacy invariant enforced in CI.' },
            { n: '03', t: 'A moat giants can’t cross', d: 'Verifiable privacy conflicts with their business model. It is ours.' },
          ].map((x, i) => (
            <Beat key={x.n} at={i + 1} b={b}>
              <div className="h-full border-t-[3px] border-rule pt-4">
                <p className="font-display text-5xl font-black text-brand-display">{x.n}</p>
                <p className="mt-3 font-display text-2xl font-bold">{x.t}</p>
                <p className="mt-2 text-ink-soft">{x.d}</p>
              </div>
            </Beat>
          ))}
        </div>
      </div>
    ),
    notes: <>Three reasons, one per click. End on the moat.</>,
  },

  /* 15 · Close */
  {
    section: 'Back page',
    builds: 1,
    render: (b) => (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <p className="kicker">The Unsaid Times · Final edition</p>
        <h2 className="max-w-5xl font-display text-[clamp(2.5rem,min(7vw,13vh),6.5rem)] font-black leading-[1] tracking-tight">
          Some things stay unsaid.{' '}
          <span className={`text-brand-display ${b >= 1 ? 'animate-rise inline-block' : 'invisible'}`}>
            <Marker>Now they stay safe.</Marker>
          </span>
        </h2>
        <Beat at={1} b={b} className="flex flex-col items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-lg text-on-brand">
            <LockIcon /> {LIVE_URL}
          </span>
          <p className="text-sm text-ink-faint">Try it · verify it · break it · UNSAID by O.M.X Lab</p>
        </Beat>
      </div>
    ),
    notes: <>Leave this up during questions.</>,
  },
];

/* ---------- charts ---------- */

function Quadrant({ showUs }: { showUs: boolean }) {
  const dot = (x: number, y: number, label: string, us = false) => (
    <g key={label}>
      <circle
        cx={x}
        cy={y}
        r={us ? 14 : 9}
        className={us ? 'fill-accent' : 'fill-ink-faint'}
      />
      <text
        x={x + (us ? 20 : 14)}
        y={y + 5}
        className={us ? 'fill-ink font-display text-[17px] font-black' : 'fill-ink-soft text-[13px]'}
      >
        {label}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 400 360" className="w-full" role="img" aria-label="Chart: AI helpfulness against verifiable privacy. UNSAID alone in the top right.">
      <rect x="40" y="10" width="350" height="300" rx="12" className="fill-paper-raised" stroke="var(--color-line)" />
      <rect x="215" y="10" width="175" height="150" rx="12" className="fill-paper-tint" />
      <line x1="215" y1="10" x2="215" y2="310" stroke="var(--color-line)" strokeDasharray="4 4" />
      <line x1="40" y1="160" x2="390" y2="160" stroke="var(--color-line)" strokeDasharray="4 4" />
      <text x="215" y="340" textAnchor="middle" className="fill-ink-faint text-[12px] uppercase tracking-widest">
        AI helpfulness →
      </text>
      <text x="16" y="160" textAnchor="middle" transform="rotate(-90 16 160)" className="fill-ink-faint text-[12px] uppercase tracking-widest">
        Privacy you can verify →
      </text>
      {dot(320, 260, 'AI chatbots')}
      {dot(90, 70, 'Encrypted notes')}
      {dot(90, 255, 'Social journals')}
      {showUs && <g className="animate-stamp origin-[300px_75px]">{dot(290, 75, 'UNSAID', true)}</g>}
    </svg>
  );
}

function Donut() {
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const tones = ['var(--color-brand-strong)', 'var(--color-brand-display)', 'var(--color-accent)', 'var(--color-ink-faint)'];
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden="true">
        {FUNDING.split.map((s, i) => {
          const len = (s.share / 100) * c;
          const el = (
            <circle
              key={s.label}
              cx="90"
              cy="90"
              r={r}
              fill="none"
              stroke={tones[i]}
              strokeWidth="26"
              strokeDasharray={`${len - 2} ${c - len + 2}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="flex flex-col gap-2 text-sm">
        {FUNDING.split.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="size-3 rounded-sm" style={{ background: tones[i] }} />
            {s.label} <span className="font-mono text-ink-faint">{s.share}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
