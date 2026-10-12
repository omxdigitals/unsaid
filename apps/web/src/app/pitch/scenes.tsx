'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icon';

/*
 * The deck's problem scenes. Each is controlled by the slide's build number so
 * one click is one beat, and each also stands alone for screen recording.
 */

/* ------------------------------------------------------------------------ */
/* Slide 2a — a typical app stores what you type, readable.                  */
/* ------------------------------------------------------------------------ */

const WATCHERS = [
  { icon: 'terminal' as IconName, who: 'Engineers', how: 'can query the table' },
  { icon: 'scroll' as IconName, who: 'Logs', how: 'copy requests in full' },
  { icon: 'database' as IconName, who: 'Backups', how: 'keep it for years' },
  { icon: 'alert' as IconName, who: 'A breach', how: 'publishes all of it' },
] as const;

export function PlaintextLeak({ watchers }: { watchers: number }) {
  const [text, setText] = useState('I can’t sleep since the layoff. I haven’t told my family.');
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <div data-interactive className="flex flex-col gap-2">
        <span className="kicker">You type, in any app</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border-2 border-field bg-paper-raised p-4 font-serif text-xl leading-snug text-ink outline-none"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="kicker !text-ember">What their database holds</span>
        <div className="overflow-hidden rounded-xl border-2 border-ink font-mono text-xs sm:text-sm">
          <div className="grid grid-cols-[4rem_1fr] bg-ink px-3 py-1.5 text-paper">
            <span>id</span>
            <span>notes.body</span>
          </div>
          <div className="grid grid-cols-[4rem_1fr] border-b border-line px-3 py-2 text-ink-faint">
            <span>4120</span>
            <span>grocery list: eggs, rice…</span>
          </div>
          <div className="grid grid-cols-[4rem_1fr] bg-accent-wash px-3 py-2 text-ink">
            <span>4121</span>
            <span className="break-words">“{text}”</span>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {WATCHERS.map((w, i) => (
            <div
              key={w.who}
              className={`rounded-xl border p-3 transition-all duration-500 ${
                i < watchers
                  ? 'translate-y-0 border-ember bg-paper-raised opacity-100'
                  : 'translate-y-2 border-line opacity-0'
              }`}
            >
              <span className="text-ember">
                <Icon name={w.icon} size={24} />
              </span>
              <p className="mt-1 font-display text-base font-bold text-ink">{w.who}</p>
              <p className="text-xs text-ink-soft">{w.how}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Slide 2b — the Ghibli selfie.                                             */
/* ------------------------------------------------------------------------ */

function Face({ ghibli = false, size = 72 }: { ghibli?: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="12" fill={ghibli ? '#FFCFBB' : '#E4DCD2'} />
      {ghibli && <circle cx="52" cy="12" r="6" fill="#FFFAF7" opacity="0.9" />}
      <circle cx="32" cy="30" r="14" fill={ghibli ? '#FEDBC9' : '#CF9C80'} />
      <path d="M17 26c2-12 28-14 30 0-6-6-24-6-30 0Z" fill={ghibli ? '#1A1410' : '#513D32'} />
      <path d="M14 64c2-14 34-14 36 0Z" fill={ghibli ? '#FF7942' : '#6B5B50'} />
      {ghibli ? (
        <>
          <ellipse cx="26.5" cy="31" rx="2.2" ry="3" fill="#1A1410" />
          <ellipse cx="37.5" cy="31" rx="2.2" ry="3" fill="#1A1410" />
          <circle cx="27" cy="30" r="0.8" fill="#fff" />
          <circle cx="38" cy="30" r="0.8" fill="#fff" />
          <circle cx="23" cy="36" r="2" fill="#FFB597" opacity="0.7" />
          <circle cx="41" cy="36" r="2" fill="#FFB597" opacity="0.7" />
        </>
      ) : (
        <>
          <circle cx="27" cy="31" r="1.3" fill="#1A1410" />
          <circle cx="37" cy="31" r="1.3" fill="#1A1410" />
        </>
      )}
      <path d="M28 38c2 1.5 6 1.5 8 0" stroke="#1A1410" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function GhibliUpload({ step }: { step: number }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
      {/* The chat. */}
      <div className="rounded-2xl border-2 border-line bg-paper-raised p-4">
        <p className="kicker !text-ink-faint">A popular AI chatbot</p>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-end justify-end gap-2">
            <div className="flex flex-col items-end gap-2 rounded-2xl rounded-br-sm bg-paper-tint p-3">
              <Face />
              <p className="text-sm text-ink">Make me Studio Ghibli style</p>
            </div>
          </div>
          <div
            className={`flex items-end gap-2 transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'translate-y-2 opacity-0'}`}
          >
            <div className="flex flex-col gap-2 rounded-2xl rounded-bl-sm border border-line bg-paper p-3">
              <Face ghibli size={112} />
              <p className="text-sm text-ink">Here you go!</p>
            </div>
          </div>
        </div>
      </div>

      {/* What happened to the selfie. */}
      <div className="flex flex-col gap-4">
        <div
          className={`rounded-2xl border-2 p-4 transition-all duration-700 ${
            step >= 2 ? 'border-ember bg-paper-raised opacity-100' : 'border-line opacity-0'
          }`}
        >
          <p className="kicker !text-ink-faint">Settings › Data controls</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-sm text-ink">Improve the model for everyone</p>
            <span className="relative h-6 w-11 shrink-0 rounded-full bg-brand">
              <span className="absolute right-0.5 top-0.5 size-5 rounded-full bg-paper" />
            </span>
          </div>
          <p className="mt-2 text-xs text-ember">On by default. Most people never open this page.</p>
        </div>

        <div
          className={`relative flex flex-col items-center rounded-2xl border-2 border-dashed p-4 transition-all duration-700 ${
            step >= 3 ? 'border-ember opacity-100' : 'border-line opacity-0'
          }`}
        >
          {step >= 3 && (
            <span className="animate-drop">
              <Face size={48} />
            </span>
          )}
          <svg viewBox="0 0 120 40" className="mt-2 w-40" aria-hidden="true">
            <path d="M5 2h110L72 38H48Z" fill="var(--color-accent-wash)" stroke="var(--color-ember)" strokeWidth="1.5" />
          </svg>
          <p className="font-display text-lg font-bold text-ink">Training data</p>
          <p className="text-center text-xs text-ink-soft">Your face, your words — now part of the product.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Slide 3 — the endless policy.                                             */
/* ------------------------------------------------------------------------ */

const CLAUSES: ReactNode[] = [
  'We collect information you provide directly to us, including content you create…',
  <>
    We <mark className="marker bg-transparent text-ink">may share your information with partners</mark> and service providers…
  </>,
  'Information may be retained for as long as necessary for business purposes…',
  <>
    Content may be used to <mark className="marker bg-transparent text-ink">improve and develop our services</mark>…
  </>,
  'Our affiliates may process data in jurisdictions with different protections…',
  <>
    <mark className="marker bg-transparent text-ink">We may update this policy at any time</mark>. Continued use means you accept…
  </>,
  'Aggregated or de-identified information may be used for any purpose…',
  'You may have rights depending on where you live, subject to exceptions…',
];

export function PolicyScroll({ highlight, agreed }: { highlight: boolean; agreed: boolean }) {
  const [minutes, setMinutes] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMinutes((m) => (m >= 38 ? 38 : m + 1)), 90);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-2xl border-2 border-line bg-paper-raised">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-display text-sm font-bold">Privacy Policy</span>
        <span className="font-mono text-xs text-ink-faint">⏱ {minutes} min to read</span>
      </div>
      <div className="relative h-56 overflow-hidden sm:h-64">
        <div className={`flex flex-col gap-3 px-5 py-4 text-[0.8rem] leading-relaxed text-ink-faint ${highlight ? '' : 'animate-[policy_9s_linear_infinite]'}`}>
          {[...CLAUSES, ...CLAUSES].map((c, i) => (
            <p key={i} className={highlight && typeof c !== 'string' ? 'text-ink' : ''}>
              <span className="mr-2 font-mono">{(i % CLAUSES.length) + 1}.</span>
              {c}
            </p>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper-raised" />
      </div>
      <div className="flex items-center gap-3 border-t border-line px-4 py-3">
        <span
          className={`grid size-5 place-items-center rounded border-2 text-xs ${agreed ? 'border-brand bg-brand text-on-brand' : 'border-field'}`}
        >
          {agreed && <Icon name="check" size={12} strokeWidth={3} />}
        </span>
        <span className="text-sm text-ink">I have read and agree</span>
        {agreed && <span className="ml-auto animate-stamp text-xs text-ember">(nobody has)</span>}
      </div>
    </div>
  );
}
