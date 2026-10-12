import type { Metadata } from 'next';
import Link from 'next/link';
import { LiveSeal } from '@/components/LiveSeal';
import { VisibilityLedger } from '@/components/VisibilityLedger';
import { WaitlistForm } from '@/components/WaitlistForm';
import { ButtonLink, Kicker, Marker, Masthead } from '@/components/editorial';
import { ResearchGrid } from '@/components/research/Research';
import { DualPipeline } from '@/components/scenes/Loops';
import { PhalaFlow } from '@/components/scenes/PhalaFlow';
import { ChainArt, ChipArt, SealArt } from '@/components/site/Decor';
import { StickyBar } from '@/components/site/Motion';
import { ExplorerMock } from '@/components/visuals/ExplorerMock';
import { PhoneMockup } from '@/components/visuals/PhoneMockup';
import { PROGRAM_ID } from '@/lib/chain';

/**
 * The landing page, set as a front page.
 *
 * Typography and the product itself do the work: the phone, the two
 * pipelines, the enclave flow, the explorer and the charts each explain one
 * thing. Ornament that explained nothing — icon tiles, pulsing pills, a grain
 * overlay, fade-ins, a "built with" word strip — is gone.
 *
 * Every number is from docs/paper/benchmarks.md and says whether it was
 * measured.
 */
export const metadata: Metadata = {
  title: 'UNSAID — private journaling, proven on Solana',
  description:
    'Write or speak the things you cannot say out loud. Encrypted on your device, reflected on by an AI only when you ask, with a receipt on Solana for every access.',
  robots: { index: true, follow: true },
};

const STEPS = [
  {
    title: 'Sealed on your phone',
    body: 'Every word is encrypted on your device with AES-256-GCM before it leaves. We only ever receive noise.',
    Art: SealArt,
  },
  {
    title: 'Reflected on, only when you ask',
    body: 'Echo reads one memory you choose. It is built to run in a hardware enclave that signs the code it ran — and the receipt records whether it did.',
    Art: ChipArt,
  },
  {
    title: 'Receipted on Solana',
    body: 'Each access writes a 212-byte, content-free receipt to a public ledger nobody can quietly edit.',
    Art: ChainArt,
  },
];

const FEATURES = [
  {
    term: 'Speak or write, immediately',
    detail: 'One tap to talk, one to write. No title, no tags, nothing to fill in before you have said anything.',
  },
  {
    term: 'A reflection, not a lecture',
    detail: 'Echo responds to one memory at a time, only when you ask, and only after you have read what that means.',
  },
  {
    term: 'Your phrase is the only key',
    detail: 'Unlocking takes about four tenths of a second. We cannot reset it, because we never had it.',
  },
  {
    term: 'Leave with everything',
    detail: 'One button exports every word, decrypted, as ordinary files that open without us on any computer.',
  },
  {
    term: 'Forget for real',
    detail: 'Forgetting destroys the key first, so even a surviving backup is unreadable noise — including to us.',
  },
  {
    term: 'Audit every access',
    detail: 'An access log with the matching on-chain receipt beside each entry, so our story can be checked.',
  },
];

const FAQ = [
  {
    q: 'Can UNSAID read what I write?',
    a: 'No. Every memory is encrypted on your device with a key derived from your phrase before it is sent. We store ciphertext and a timestamp. Our own leak test searched the whole database, every stored file and every log for 30 planted secrets and found none.',
  },
  {
    q: 'Then how can the AI reflect on it?',
    a: 'Only when you ask, for one memory at a time, after a disclosure you confirm. That memory is opened on your phone and sent for one reply; we keep neither the text nor the reply. Echo is built to run inside a hardware enclave (Intel TDX with NVIDIA confidential computing) that signs which code ran. When a reflection runs on a standard AI provider instead, the receipt records it as unattested — it never claims a guarantee it did not have.',
  },
  {
    q: 'What exactly goes on the blockchain?',
    a: 'A 212-byte consent receipt: which memory (as a hash), the consent version you agreed to, the enclave measurement if there was one, a hash of the reply, and the time. Never your words, your voice, or your identity. Anyone can verify a receipt at /verify without our servers.',
  },
  {
    q: 'Do I need a crypto wallet?',
    a: 'No. Everything works without one. A wallet is only needed if you want to anchor a memory under your own key as proof it existed and is yours.',
  },
  {
    q: 'What if I forget my phrase?',
    a: 'Your recovery kit — shown once when you create a vault — lets you set a new phrase. If you lose both, the vault stays locked forever. That is the price of nobody else holding a key.',
  },
  {
    q: 'Is this therapy?',
    a: 'No. UNSAID is a private place to write and reflect. It is not a clinical service and cannot assess how you are. If you are in danger, contact local emergency services.',
  },
];

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#chain', label: 'On-chain' },
  { href: '/research', label: 'Research' },
  { href: '#faq', label: 'FAQ' },
  { href: '/verify', label: 'Verify' },
];

/** One section heading style for the whole page. */
function SectionHead({
  kicker,
  children,
  aside,
}: {
  kicker: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-t-[3px] border-rule pt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
      <div className="max-w-3xl">
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-3 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-black leading-[1.02] tracking-[-0.02em] text-ink">
          {children}
        </h2>
      </div>
      {aside && <div className="max-w-md text-lg leading-relaxed text-ink-soft lg:pb-1">{aside}</div>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <StickyBar links={NAV} />

      <div className="container-page">
        <Masthead
          nav={
            <nav aria-label="Primary" className="flex items-center gap-4 text-sm text-ink-soft sm:gap-7">
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} className="hidden hover:text-ink md:inline">
                  {label}
                </Link>
              ))}
              <Link href="/verify" className="hover:text-ink md:hidden">
                Verify
              </Link>
              <ButtonLink href="/app" className="!px-4 !py-2">
                Open the app
              </ButtonLink>
            </nav>
          }
          dateline={
            <>
              <span>Vol. 1 · The encrypted edition</span>
              <span className="hidden md:inline">Built on Solana · Live on devnet</span>
              <span className="hidden sm:inline">No account · No email · No audience</span>
            </>
          }
        />
      </div>

      <main>
        {/* Lead */}
        <section className="container-page grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-24">
          <div>
            <h1 className="font-display text-[clamp(2.7rem,5.4vw,5.25rem)] font-black leading-[0.95] tracking-[-0.025em] text-ink">
              Not every thought needs an{' '}
              <span className="text-brand-display">
                <Marker>audience.</Marker>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              A private journal with an AI that reflects only when you ask — and a receipt on
              Solana for every time anything touches what you wrote.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/app" size="lg">
                Start writing
              </ButtonLink>
              <ButtonLink href="/verify" variant="quiet" size="lg">
                Verify a receipt
              </ButtonLink>
            </div>
            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-5">
              {[
                ['0', 'plaintext we hold'],
                ['212 B', 'per on-chain receipt'],
                ['0.4 s', 'to unlock'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-2xl font-black text-ink sm:text-3xl">{v}</dd>
                  <dd className="mt-0.5 text-xs text-ink-faint sm:text-sm">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:justify-self-end">
            <PhoneMockup />
          </div>
        </section>

        {/* The problem */}
        <section aria-label="The problem" className="container-page pb-20 sm:pb-28">
          <SectionHead
            kicker="The problem"
            aside="The same sentence through two designs. One ends in a database and a training set. The other ends as noise, plus a public receipt."
          >
            Most apps keep your words <span className="text-brand-display">readable.</span>
          </SectionHead>
          <div className="mt-10">
            <DualPipeline />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="container-page scroll-mt-16 pb-20 sm:pb-28">
          <SectionHead kicker="How it works">
            Privacy you can <span className="text-brand-display">check</span>, not just trust.
          </SectionHead>
          <ol className="mt-12 grid gap-x-10 gap-y-14 md:grid-cols-3">
            {STEPS.map(({ title, body, Art }, i) => (
              <li key={title} className="flex flex-col">
                <Art />
                <p className="mt-6 font-display text-5xl font-black leading-none text-line">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ink">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Echo */}
        <section id="echo" className="container-page scroll-mt-16 pb-20 sm:pb-28">
          <SectionHead
            kicker="Echo · private AI"
            aside="A model cannot reflect on words it cannot read, so the one memory you choose is opened for one reply, then sealed again on your phone. The receipt says where it ran."
          >
            An AI that reflects — <span className="text-brand-display">and keeps nothing.</span>
          </SectionHead>
          <div className="mt-10">
            <PhalaFlow autoplay />
          </div>
        </section>

        {/* On-chain */}
        <section id="chain" className="scroll-mt-0 bg-night text-paper">
          <div className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <p className="kicker !text-brand">On-chain · Solana</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-black leading-[1.02] tracking-[-0.02em]">
                Every access leaves a receipt.{' '}
                <span className="text-brand">None of them hold a word.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#d9cfc6]">
                An Anchor program records who accessed a memory, under which consent, in which
                enclave, and a hash of the reply — never the memory itself. It is the one record we
                cannot edit after the fact, which is why it is there.
              </p>
              <div className="mt-8 max-w-lg">
                <div className="flex justify-between text-xs text-[#a8988b]">
                  <span>One receipt, in one Solana transaction</span>
                  <span>212 of 1,232 bytes</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-night-raised">
                  <div className="h-full w-[17.2%] rounded-full bg-brand" />
                </div>
                <p className="mt-6 text-xs text-[#a8988b]">Program id · devnet</p>
                <p className="mt-1 break-all font-mono text-sm">{PROGRAM_ID}</p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brand px-6 py-3 font-medium text-on-brand transition-colors hover:bg-brand-bright"
                >
                  Verify a receipt yourself
                </Link>
                <a
                  href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#6b5b50] px-6 py-3 font-medium transition-colors hover:border-paper"
                >
                  Open in Solana Explorer
                </a>
              </div>
            </div>
            <ExplorerMock />
          </div>
        </section>

        {/* Research */}
        <section id="research" aria-label="Our research" className="container-page scroll-mt-16 py-20 sm:py-28">
          <SectionHead
            kicker="Our research"
            aside={
              <>
                Every figure comes from a script in our repository, run on a 2015 laptop on purpose.{' '}
                <Link href="/research" className="font-medium text-brand-strong underline underline-offset-4">
                  Full research
                </Link>
              </>
            }
          >
            Private, and still fast. <span className="text-brand-display">We measured.</span>
          </SectionHead>
          <div className="mt-10">
            <ResearchGrid />
          </div>
        </section>

        {/* Try it */}
        <section className="bg-paper-tint">
          <div className="container-page grid gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <div>
              <Kicker>Try it</Kicker>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-black leading-[1.02] tracking-[-0.02em] text-ink">
                Don&rsquo;t take our word for it.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
                This runs the product&rsquo;s real encryption in your browser, on your sentence, and
                shows exactly what we would receive.
              </p>
            </div>
            <LiveSeal />
          </div>
        </section>

        {/* Disclosure */}
        <section className="container-page py-20 sm:py-28">
          <SectionHead
            kicker="Full disclosure"
            aside="Both columns are complete. The left one is short because there is genuinely nothing else in it."
          >
            Exactly what we can see.
          </SectionHead>
          <div className="mt-10">
            <VisibilityLedger />
          </div>
        </section>

        {/* Features */}
        <section className="container-page pb-20 sm:pb-28">
          <SectionHead kicker="In the app">Everything a private journal should be.</SectionHead>
          <dl className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.term} className="border-t border-line py-6">
                <dt className="font-display text-xl font-bold text-ink">{f.term}</dt>
                <dd className="mt-2 leading-relaxed text-ink-soft">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Promises + caveat */}
        <section className="container-page grid gap-12 pb-20 sm:pb-28 lg:grid-cols-2 lg:gap-16">
          <div className="border-t-[3px] border-rule pt-6">
            <Kicker>Our promises</Kicker>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
              What we will not do
            </h2>
            <ol className="mt-6 divide-y divide-line">
              {[
                'Read what you write. We built it so that we cannot.',
                'Sell your data, or use it to target anything at you.',
                'Train models on your memories.',
                'Give you a follower count, a streak, or a reason to perform.',
                'Pretend to be therapy. UNSAID is not a clinical service.',
              ].map((line, i) => (
                <li key={line} className="flex gap-5 py-4 leading-relaxed text-ink">
                  <span className="w-6 shrink-0 font-mono text-sm text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                  {line}
                </li>
              ))}
            </ol>
          </div>
          <div className="border-t-[3px] border-caution pt-6">
            <p className="kicker !text-caution">Editor&rsquo;s note · The honest caveat</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
              Nothing is unbreakable
            </h2>
            <p className="mt-6 leading-relaxed text-ink">
              A device that is already compromised can read what you type before we ever encrypt it,
              and we do not promise anonymity from someone with access to your device or network.
              What we promise is narrower and testable: a leak of our database or storage does not
              expose what you wrote. Lose your phrase and your recovery kit, and your memories stay
              locked — including from us.
            </p>
            <Link href="/privacy" className="mt-6 inline-block font-medium text-brand-strong underline underline-offset-4">
              Read exactly how this works
            </Link>
          </div>
        </section>

        {/* Questions */}
        <section id="faq" className="container-page scroll-mt-16 pb-20 sm:pb-28">
          <SectionHead kicker="Questions">Asked, and answered plainly.</SectionHead>
          {/* Native disclosure: works without JavaScript, keyboard and screen-reader ready. */}
          <div className="mt-8 grid gap-x-16 lg:grid-cols-2">
            {[FAQ.slice(0, 3), FAQ.slice(3)].map((col, c) => (
              <div key={c} className="divide-y divide-line border-b border-line">
                {col.map((f) => (
                  <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-bold text-ink">
                      {f.q}
                      <span aria-hidden="true" className="mt-1 font-mono text-lg leading-none text-ink-faint transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{f.a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Early access */}
        <section className="bg-brand">
          <div className="container-page grid gap-8 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="kicker !text-ink">Early access</p>
              <h2 className="mt-3 font-display text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.98] tracking-tight text-ink">
                Thirty people first.
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-ink">
                We would rather get it right for thirty people than be adequate for thousands.
              </p>
            </div>
            <div className="rounded-2xl bg-paper p-6 sm:p-8">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-night text-[#d9cfc6]">
        <div className="container-page py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-masthead text-3xl font-black uppercase tracking-[0.04em] text-paper">
                The Unsaid Times
              </p>
              <p className="mt-2 text-sm">Private journaling, proven on Solana. An O.M.X Lab project.</p>
            </div>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="hover:text-paper">How it works</Link>
              <Link href="/research" className="hover:text-paper">Research</Link>
              <Link href="/verify" className="hover:text-paper">Verify</Link>
              <Link href="/legal/privacy" className="hover:text-paper">Privacy policy</Link>
              <Link href="/legal/terms" className="hover:text-paper">Terms</Link>
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-night-line pt-6 text-xs text-[#a8988b] sm:flex-row sm:justify-between">
            <span>Not a crisis service. If you are in danger, contact local emergency services.</span>
            <span className="font-mono">{PROGRAM_ID.slice(0, 8)}… · devnet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
