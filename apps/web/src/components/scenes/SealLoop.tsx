'use client';

import { useEffect, useState } from 'react';

/**
 * The whole product in six seconds, on a loop: a sentence is written, turns to
 * noise on the device, travels as noise, is stored as noise, and comes back
 * readable only on the phone it started on.
 *
 * This is an illustration, not the encryption — the noise is random glyphs, and
 * `LiveSeal` is where the real AES-GCM runs. It exists so the idea can be seen
 * at a glance (and screen-recorded for the deck) without a button press.
 */

const SENTENCE = 'I have not told anyone how tired I am.';
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

type Stage = 'typing' | 'sealing' | 'travel' | 'stored' | 'return';
const ORDER: Stage[] = ['typing', 'sealing', 'travel', 'stored', 'return'];
const DURATION: Record<Stage, number> = {
  typing: 2200,
  sealing: 900,
  travel: 1100,
  stored: 1300,
  return: 1800,
};

function noise(length: number) {
  let out = '';
  for (let i = 0; i < length; i += 1) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return out;
}

export function SealLoop({ className = '' }: { className?: string }) {
  const [stage, setStage] = useState<Stage>('typing');
  const [typed, setTyped] = useState(0);
  const [cipher, setCipher] = useState(() => 'x'.repeat(SENTENCE.length));

  // Stage clock. Reduced motion holds on the "stored" frame, which tells the
  // whole story in one still: readable on the left, noise on the server.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(SENTENCE.length);
      setCipher(noise(SENTENCE.length));
      setStage('stored');
      return;
    }
    const timer = setTimeout(() => {
      const next = ORDER[(ORDER.indexOf(stage) + 1) % ORDER.length]!;
      if (next === 'typing') setTyped(0);
      setStage(next);
    }, DURATION[stage]);
    return () => clearTimeout(timer);
  }, [stage]);

  // Typewriter.
  useEffect(() => {
    if (stage !== 'typing' || typed >= SENTENCE.length) return;
    const t = setTimeout(() => setTyped((n) => n + 1), 45);
    return () => clearTimeout(t);
  }, [stage, typed]);

  // Scramble while sealing; freeze once sealed.
  useEffect(() => {
    if (stage !== 'sealing') return;
    const t = setInterval(() => setCipher(noise(SENTENCE.length)), 60);
    return () => clearInterval(t);
  }, [stage]);

  const sealed = stage !== 'typing';
  const onServer = stage === 'travel' || stage === 'stored';
  const back = stage === 'return';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-paper-raised p-5 sm:p-6 ${className}`}
      aria-label="Illustration: a sentence is encrypted on the device, stored as unreadable text, and decrypted only on the device."
      role="img"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Phone */}
        <div className="flex flex-col gap-2">
          <p className="kicker">Your phone</p>
          <div className="min-h-[7.5rem] rounded-xl border border-line bg-paper p-3">
            <p className="font-serif text-[0.95rem] leading-snug text-ink">
              {back || stage === 'typing' ? (
                <>
                  {back ? SENTENCE : SENTENCE.slice(0, typed)}
                  {stage === 'typing' && (
                    <span className="ml-px inline-block h-4 w-px animate-pulse bg-ink align-middle" />
                  )}
                </>
              ) : (
                <span className="break-all font-mono text-[0.7rem] leading-relaxed text-brand-strong">
                  {cipher}
                </span>
              )}
            </p>
            {back && (
              <p className="mt-2 animate-fade text-[0.7rem] text-safe">Unlocked on this device only</p>
            )}
          </div>
        </div>

        {/* The wire */}
        <div className="relative flex h-full w-10 flex-col items-center justify-center sm:w-16">
          <div className="h-px w-full bg-line" />
          <span
            className={`absolute grid size-7 place-items-center rounded-full border text-xs transition-all duration-700 ${
              sealed ? 'border-brand bg-brand text-on-brand' : 'border-line bg-paper text-ink-faint'
            } ${onServer ? 'translate-x-3 sm:translate-x-5' : back ? '-translate-x-3 sm:-translate-x-5' : ''}`}
            aria-hidden="true"
          >
            <LockIcon closed={sealed && !back} />
          </span>
        </div>

        {/* Server */}
        <div className="flex flex-col gap-2">
          <p className="kicker">Our server</p>
          <div className="min-h-[7.5rem] rounded-xl border border-dashed border-field bg-paper-tint p-3">
            {onServer || back ? (
              <>
                <p className="break-all font-mono text-[0.7rem] leading-relaxed text-ink-soft">
                  {cipher}
                </p>
                <p className="mt-2 text-[0.7rem] text-ink-faint">
                  {stage === 'travel' ? 'Arriving…' : 'Stored. Unreadable — to us too.'}
                </p>
              </>
            ) : (
              <p className="text-[0.7rem] text-ink-faint">Waiting. Nothing readable ever arrives.</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress pips: which beat of the loop this is. */}
      <ol className="mt-4 flex gap-1.5" aria-hidden="true">
        {ORDER.map((s) => (
          <li
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              ORDER.indexOf(s) <= ORDER.indexOf(stage) ? 'bg-brand' : 'bg-line'
            }`}
          />
        ))}
      </ol>
    </div>
  );
}

export function LockIcon({ closed = true, className = '' }: { closed?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
      <path
        d={closed ? 'M5 7V5a3 3 0 0 1 6 0v2' : 'M5 7V5a3 3 0 0 1 5.8-1'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
