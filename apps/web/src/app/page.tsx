import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, type IconName } from '@/components/Icon';
import { LiveSeal } from '@/components/LiveSeal';
import { VisibilityLedger } from '@/components/VisibilityLedger';
import { WaitlistForm } from '@/components/WaitlistForm';
import { ButtonLink, Kicker, Marker, Masthead } from '@/components/editorial';
import { ResearchGrid } from '@/components/research/Research';
import { DualPipeline } from '@/components/scenes/Loops';
import { PhalaFlow } from '@/components/scenes/PhalaFlow';
import { ChainArt, ChipArt, NewsTicker, SealArt } from '@/components/site/Decor';
import { Reveal, StickyBar } from '@/components/site/Motion';
import { ExplorerMock } from '@/components/visuals/ExplorerMock';
import { PROGRAM_ID } from '@/lib/chain';
import { PhoneMockup } from '@/components/visuals/PhoneMockup';

/**
 * The landing page, set as a front page.
 *
 * It leads with the human problem, then shows the product on a phone, then
 * the chain — because the chain is what turns "we promise" into "check it".
 * Every number is from docs/paper/benchmarks.md and says whether it was
 * measured. The visuals are drawn in code, not photographs, so they stay sharp
 * at any size and the page makes no request to an image host.
 */
export const metadata: Metadata = {
  title: 'UNSAID — private journaling, proven on Solana',
  description:
    'Write or speak the things you cannot say out loud. Encrypted on your device, reflected on by an AI that cannot leak it, with a receipt on Solana for every access.',
  robots: { index: true, follow: true },
};

const STACK = ['Solana', 'Anchor', 'Phala Network', 'Intel TDX', 'AES-256-GCM', 'WebCrypto'];

const STEPS: { icon: IconName; title: string; body: string; art: 'seal' | 'chip' | 'chain' }[] = [
  {
    icon: 'lock',
    title: 'Sealed on your phone',
    body: 'Every word is encrypted on your device with AES-256-GCM before it leaves. We only ever receive noise.',
    art: 'seal',
  },
  {
    icon: 'cpu',
    title: 'Reflected on in a sealed chip',
    body: 'Ask Echo for a reflection and it runs inside a hardware enclave that signs what code it ran.',
    art: 'chip',
  },
  {
    icon: 'block',
    title: 'Receipted on Solana',
    body: 'Each access writes a 212-byte, content-free receipt to a public ledger nobody can quietly edit.',
    art: 'chain',
  },
];

const FEATURES: { icon: IconName; term: string; detail: string }[] = [
  {
    icon: 'mic',
    term: 'Speak or write, immediately',
    detail:
      'One tap to talk, one to write. No title, no tags, nothing to fill in before you have said anything.',
  },
  {
    icon: 'sparkle',
    term: 'A reflection, not a lecture',
    detail:
      'Echo responds to one memory at a time, only when you ask, and only after you have read what that means.',
  },
  {
    icon: 'key',
    term: 'Your phrase is the only key',
    detail:
      'Unlocking takes about four tenths of a second. We cannot reset it, because we never had it.',
  },
  {
    icon: 'download',
    term: 'Leave with everything',
    detail:
      'One button exports every word, decrypted, as ordinary files that open without us on any computer.',
  },
  {
    icon: 'x',
    term: 'Forget for real',
    detail:
      'Forgetting destroys the key first, so even a surviving backup is unreadable noise — including to us.',
  },
  {
    icon: 'search',
    term: 'Audit every access',
    detail:
      'An access log with the matching on-chain receipt beside each entry, so our story can be checked.',
  },
];

const ART = { seal: SealArt, chip: ChipArt, chain: ChainArt };

const FAQ = [
  {
    q: 'Can UNSAID read what I write?',
    a: 'No. Every memory is encrypted on your device with a key derived from your phrase before it is sent. We store ciphertext and a timestamp. Our own leak test searched the whole database, every stored file and every log for 30 planted secrets and found none.',
  },
  {
    q: 'Then how can the AI reflect on it?',
    a: 'Only when you ask, for one memory at a time. That memory is opened on your phone and read inside a hardware enclave (Intel TDX with NVIDIA confidential computing) that signs which code ran. Nobody outside the chip — including us — sees it, and the signature goes on the receipt.',
  },
  {
    q: 'What exactly goes on the blockchain?',
    a: 'A 212-byte consent receipt: which memory (as a hash), the consent version you agreed to, the enclave measurement, a hash of the reply, and the time. Never your words, your voice, or your identity. A stranger can verify any receipt at /verify without our servers.',
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
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <div aria-hidden="true" className="grain" />
      <StickyBar links={[...NAV]} />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
        <Masthead
          nav={
            <nav
              aria-label="Primary"
              className="flex items-center gap-4 text-sm text-ink-soft sm:gap-6"
            >
              {NAV.map(({ href, label }) => (
                <Link key={href} href={href} className="hidden hover:text-brand-strong sm:inline">
                  {label}
                </Link>
              ))}
              <Link href="/verify" className="hover:text-brand-strong sm:hidden">
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

      <div className="mt-4">
        <NewsTicker />
      </div>

      <main>
        {/* ── Lead story ─────────────────────────────────────────────── */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-14 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:pb-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1.5 text-xs font-medium text-ink">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              Live on Solana devnet
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6.4vw,4.9rem)] font-black leading-[0.96] tracking-[-0.02em] text-ink">
              Not every thought needs an{' '}
              <span className="text-brand-display">
                <Marker>audience.</Marker>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              A private journal with an AI that can&rsquo;t read your secrets — and a receipt on
              Solana for every time anything touches them.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/app" size="lg">
                Start writing
                <Icon name="arrowRight" size={18} strokeWidth={2.2} />
              </ButtonLink>
              <ButtonLink href="/verify" variant="quiet" size="lg">
                Verify a receipt
              </ButtonLink>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t-[3px] border-rule pt-5">
              {[
                ['0', 'plaintext we hold'],
                ['212 B', 'per on-chain receipt'],
                ['0.4 s', 'to unlock'],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-2xl font-black text-ink sm:text-3xl">{v}</dd>
                  <dd className="text-xs text-ink-faint">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative py-6 [animation-delay:150ms] animate-rise">
            {/* Halftone sun behind the phone — the newspaper's printing dots, in orange. */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-[min(30rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(var(--color-brand)_1.4px,transparent_1.6px)] [background-size:12px_12px] opacity-40 [mask-image:radial-gradient(circle,black_35%,transparent_70%)]"
            />
            <PhoneMockup />
          </div>
        </section>

        {/* ── Built with ─────────────────────────────────────────────── */}
        <section aria-label="Built with" className="border-y border-line bg-paper-raised">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 sm:justify-between sm:px-8">
            <span className="kicker !text-ink-faint">Built with</span>
            {STACK.map((name) => (
              <span
                key={name}
                className="font-display text-sm font-bold tracking-tight text-ink-soft sm:text-base"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ── The difference ─────────────────────────────────────────── */}
        <section
          aria-label="The difference"
          className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-8 sm:pt-24"
        >
          <Reveal>
            <div className="max-w-3xl">
              <Kicker>The problem</Kicker>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-tight tracking-tight text-ink">
                Most apps keep your words <span className="text-brand-display">readable.</span> We
                don&rsquo;t.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
                The same sentence, through two designs. One ends in a database and a training set.
                The other ends as noise, plus a public receipt.
              </p>
            </div>
            <div className="mt-10">
              <DualPipeline />
            </div>
          </Reveal>
        </section>

        {/* ── How it works ───────────────────────────────────────────── */}
        <section
          id="how"
          className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="max-w-2xl">
            <Kicker>How it works</Kicker>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-tight tracking-tight text-ink">
              Privacy you can <span className="text-brand-display">check</span>, not just trust.
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => {
              const Art = ART[step.art];
              return (
                <li key={step.title}>
                  <Reveal delay={i * 120} className="h-full">
                    <div className="group flex h-full flex-col rounded-3xl border border-line bg-paper-raised p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_-30px_rgba(26,20,16,0.45)]">
                      <Art />
                      <div className="px-4 pb-4 pt-6">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-brand text-on-brand">
                            <Icon name={step.icon} size={20} strokeWidth={2} />
                          </span>
                          <span className="font-mono text-xs text-ink-faint">
                            Step {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-xl font-bold text-ink">
                          {step.title}
                        </h3>
                        <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Echo ───────────────────────────────────────────────────── */}
        <section
          id="echo"
          className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 pb-16 sm:px-8 sm:pb-24"
        >
          <Reveal className="rounded-[2rem] border border-line bg-paper-raised p-6 shadow-[0_40px_80px_-50px_rgba(26,20,16,0.45)] sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
              <div>
                <Kicker>Echo · private AI</Kicker>
                <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] font-black leading-tight tracking-tight text-ink">
                  An AI that reflects —{' '}
                  <span className="text-brand-display">and can&rsquo;t leak.</span>
                </h2>
              </div>
              <p className="leading-relaxed text-ink-soft">
                A model cannot reflect on words it cannot read, so the one memory you choose is read
                inside a sealed chip that signs what code it ran. The reply comes back to your phone
                and is sealed again; a receipt lands on Solana. Five steps, on a loop:
              </p>
            </div>
            <div className="mt-8">
              <PhalaFlow autoplay />
            </div>
          </Reveal>
        </section>

        {/* ── On-chain band ──────────────────────────────────────────── */}
        <section id="chain" className="scroll-mt-0 bg-night text-paper">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="kicker !text-brand">On-chain · Solana</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-tight tracking-tight">
                Every access leaves a receipt.{' '}
                <span className="text-brand">None of them hold a word.</span>
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-[#d9cfc6]">
                An Anchor program on Solana records who accessed a memory, under which consent, in
                which enclave, and a hash of the reply — never the memory itself. It is the one
                record we cannot edit after the fact, which is exactly why it is there.
              </p>

              <div className="mt-8">
                <div className="flex justify-between text-xs text-[#a8988b]">
                  <span>One receipt, in one Solana transaction</span>
                  <span>212 of 1,232 bytes</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-night-raised">
                  <div className="h-full w-[17.2%] rounded-full bg-brand" />
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-night-line bg-night-raised p-4">
                <p className="text-xs text-[#a8988b]">Program id · devnet</p>
                <p className="mt-1 break-all font-mono text-sm text-paper">{PROGRAM_ID}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/verify"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 py-3 font-medium text-on-brand transition-colors hover:bg-brand-bright"
                >
                  <Icon name="search" size={18} strokeWidth={2} />
                  Verify a receipt yourself
                </Link>
                <a
                  href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#6b5b50] px-6 py-3 font-medium text-paper transition-colors hover:border-paper"
                >
                  Open in Solana Explorer
                </a>
              </div>
            </div>
            <ExplorerMock />
          </div>
        </section>

        {/* ── Research ───────────────────────────────────────────────── */}
        <section
          id="research"
          aria-label="Our research"
          className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Kicker>Our research</Kicker>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black leading-tight tracking-tight text-ink">
                Private, and still fast. <span className="text-brand-display">We measured.</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Every figure comes from a script in our repository, run on a 2015 laptop on purpose.
              </p>
            </div>
            <ButtonLink href="/research" variant="quiet" className="shrink-0">
              Full research
              <Icon name="arrowRight" size={16} strokeWidth={2.2} />
            </ButtonLink>
          </div>
          <div className="mt-10">
            <Reveal>
              <ResearchGrid />
            </Reveal>
          </div>
        </section>

        {/* ── Try it ─────────────────────────────────────────────────── */}
        <section className="bg-paper-tint">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <Kicker>Try it</Kicker>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-black leading-tight tracking-tight text-ink">
                Don&rsquo;t take our word for it.
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                This runs the product&rsquo;s real encryption in your browser, on your sentence, and
                shows exactly what we would receive.
              </p>
            </div>
            <LiveSeal />
          </div>
        </section>

        {/* ── Disclosure ─────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
          <Kicker>Full disclosure</Kicker>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-black leading-tight tracking-tight text-ink">
            Exactly what we can see
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
            Both columns are complete. The left one is short because there is genuinely nothing else
            in it.
          </p>
          <div className="mt-8">
            <VisibilityLedger />
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8 sm:pb-20">
          <div className="border-t-[3px] border-rule pt-12">
            <Kicker>Features</Kicker>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-black leading-tight tracking-tight text-ink">
              Everything a private journal should be
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((item, i) => (
              <Reveal key={item.term} delay={(i % 3) * 100}>
                <div className="h-full rounded-3xl border border-line bg-paper-raised p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_24px_48px_-30px_rgba(26,20,16,0.4)]">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-wash text-brand-strong">
                    <Icon name={item.icon} size={22} strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">{item.term}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Promises + caveat ──────────────────────────────────────── */}
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 sm:px-8 sm:pb-20 lg:grid-cols-2">
          <div className="rounded-3xl border-2 border-ink p-7 sm:p-9">
            <Kicker>Our promises</Kicker>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink">
              What we will not do
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {[
                'Read what you write. We built it so that we cannot.',
                'Sell your data, or use it to target anything at you.',
                'Train models on your memories.',
                'Give you a follower count, a streak, or a reason to perform.',
                'Pretend to be therapy. UNSAID is not a clinical service.',
              ].map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-ink">
                  <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-paper">
                    <Icon name="x" size={11} strokeWidth={3} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-caution-wash p-7 sm:p-9">
            <p className="kicker !text-caution">Editor&rsquo;s note · The honest caveat</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink">
              Nothing is unbreakable
            </h2>
            <p className="mt-5 leading-relaxed text-ink">
              A device that is already compromised can read what you type before we ever encrypt it,
              and we do not promise anonymity from someone with access to your device or network.
              What we promise is narrower and testable: a leak of our database or storage does not
              expose what you wrote. Lose your phrase and your recovery kit, and your memories stay
              locked — including from us.
            </p>
            <Link
              href="/privacy"
              className="mt-6 inline-flex items-center gap-2 font-medium text-brand-strong underline underline-offset-4"
            >
              Read exactly how this works
              <Icon name="arrowRight" size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </section>

        {/* ── Questions ──────────────────────────────────────────────── */}
        <section
          id="faq"
          className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-[1fr_1.6fr]"
        >
          <div>
            <Kicker>Questions</Kicker>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-black leading-tight tracking-tight text-ink">
              Asked, and answered plainly.
            </h2>
          </div>
          {/* Native disclosure: works without JavaScript, keyboard and screen-reader ready. */}
          <div className="divide-y divide-line border-y-2 border-ink">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-bold text-ink">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-transform duration-300 group-open:rotate-45 group-open:border-brand group-open:bg-brand">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Early access ───────────────────────────────────────────── */}
        <section className="bg-brand">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="kicker !text-ink">Early access</p>
              <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.75rem)] font-black leading-[1] tracking-tight text-ink">
                Thirty people first.
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink">
                We would rather get it right for thirty people than be adequate for thousands.
              </p>
            </div>
            <div className="rounded-3xl bg-paper p-6 shadow-[0_24px_48px_-28px_rgba(26,20,16,0.5)] sm:p-8">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-night text-[#d9cfc6]">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-masthead text-3xl font-black uppercase tracking-[0.04em] text-paper">
                The Unsaid Times
              </p>
              <p className="mt-2 text-sm">
                Private journaling, proven on Solana. An O.M.X Lab project.
              </p>
            </div>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/privacy" className="hover:text-paper">
                How it works
              </Link>
              <Link href="/research" className="hover:text-paper">
                Research
              </Link>
              <Link href="/verify" className="hover:text-paper">
                Verify
              </Link>
              <Link href="/legal/privacy" className="hover:text-paper">
                Privacy policy
              </Link>
              <Link href="/legal/terms" className="hover:text-paper">
                Terms
              </Link>
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-night-line pt-6 text-xs text-[#a8988b] sm:flex-row sm:justify-between">
            <span>
              Not a crisis service. If you are in danger, contact local emergency services.
            </span>
            <span className="font-mono">{PROGRAM_ID.slice(0, 8)}… · devnet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
