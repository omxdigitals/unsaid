'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';
import { APPENDIX, PITCH, type Slide } from './slides';
import { TECH } from './tech';
import { PITCH_SECONDS } from './data';

/**
 * Which deck. A string, not the slide list, because the slides hold render
 * functions and the page that picks the deck is a server component.
 */
export type DeckName = 'pitch' | 'tech' | 'appendix';
const DECKS: Record<DeckName, Slide[]> = { pitch: PITCH, tech: TECH, appendix: APPENDIX };
const LABEL: Record<DeckName, string> = {
  pitch: 'Pitch · 3 min',
  tech: 'Technical demo',
  appendix: 'Appendix',
};

/**
 * The deck engine. One slide at a time; each slide declares how many beats
 * ("builds") it has, and every click reveals the next one before the deck
 * moves on. The position lives in the URL hash as `#slide.build`, so a refresh
 * mid-pitch — or a link sent to a judge — lands on the same beat.
 *
 * Keys: → / Space / PageDown / click advance · ← / PageUp go back ·
 * F fullscreen · N presenter notes · Home / End jump.
 */

function parseHash(SLIDES: Slide[]): { slide: number; build: number } {
  const match = /^#(\d+)(?:\.(\d+))?$/.exec(window.location.hash);
  if (!match) return { slide: 0, build: 0 };
  const slide = Math.min(Math.max(Number(match[1]) - 1, 0), SLIDES.length - 1);
  const build = Math.min(Number(match[2] ?? 0), SLIDES[slide]!.builds);
  return { slide, build };
}

export function Deck({ deck = 'pitch' }: { deck?: DeckName }) {
  const SLIDES = DECKS[deck];
  const [pos, setPos] = useState({ slide: 0, build: 0 });
  const [notes, setNotes] = useState(false);
  // The hash is read once on mount; until then, writing it back would clobber
  // the beat a shared link pointed at with the default `#1`.
  const [ready, setReady] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setPos(parseHash(SLIDES));
    setReady(true);
    const onHash = () => setPos(parseHash(SLIDES));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const hash = `#${pos.slide + 1}${pos.build ? `.${pos.build}` : ''}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [pos, ready]);

  // Rehearsal clock. Starts on the first advance (or T), so opening the deck
  // early does not eat into the three minutes. R resets it.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (startedAt === null) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [startedAt]);

  const next = useCallback(() => {
    setStartedAt((t) => t ?? Date.now());
    setPos(({ slide, build }) => {
      if (build < SLIDES[slide]!.builds) return { slide, build: build + 1 };
      if (slide < SLIDES.length - 1) return { slide: slide + 1, build: 0 };
      return { slide, build };
    });
  }, []);

  const prev = useCallback(() => {
    setPos(({ slide, build }) => {
      if (build > 0) return { slide, build: build - 1 };
      if (slide > 0) return { slide: slide - 1, build: SLIDES[slide - 1]!.builds };
      return { slide, build };
    });
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Typing into a live demo on a slide must not flip the slide.
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, [contenteditable="true"]')) return;
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        prev();
      } else if (event.key === 'Home') setPos({ slide: 0, build: 0 });
      else if (event.key === 'End') setPos({ slide: SLIDES.length - 1, build: 0 });
      else if (event.key === 'f' || event.key === 'F') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen?.();
      } else if (event.key === 'n' || event.key === 'N') setNotes((v) => !v);
      else if (event.key === 't' || event.key === 'T') setStartedAt((t) => t ?? Date.now());
      else if (event.key === 'r' || event.key === 'R') setStartedAt(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, SLIDES]);

  const slide = SLIDES[pos.slide]!;
  const totalBeats = SLIDES.reduce((n, s) => n + s.builds + 1, 0);
  const beat = SLIDES.slice(0, pos.slide).reduce((n, s) => n + s.builds + 1, 0) + pos.build + 1;

  // Where the clock should be by the end of this slide, from the per-slide budgets.
  const timed = SLIDES.some((s) => s.seconds);
  const elapsed = startedAt === null ? 0 : Math.max(0, Math.floor((now - startedAt) / 1000));
  const dueBy = SLIDES.slice(0, pos.slide + 1).reduce((n, s) => n + (s.seconds ?? 0), 0);
  const behind = startedAt !== null && elapsed > dueBy;
  const over = elapsed > PITCH_SECONDS;
  const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <div
      className="relative flex h-dvh w-full select-none flex-col overflow-hidden bg-paper text-ink"
      onClick={(event) => {
        // Interactive bits on a slide handle their own clicks.
        if ((event.target as HTMLElement).closest('button, a, input, textarea, label, [data-interactive]'))
          return;
        next();
      }}
      onTouchStart={(event) => {
        touchX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchX.current;
        const end = event.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        if (start - end > 50) next();
        else if (end - start > 50) prev();
      }}
    >
      {/* Progress, a thin orange line across the very top. */}
      <div className="absolute inset-x-0 top-0 h-1 bg-line">
        <div
          className="h-full bg-brand transition-[width] duration-500"
          style={{ width: `${(beat / totalBeats) * 100}%` }}
        />
      </div>

      {/* Running masthead. */}
      <header className="mx-auto flex w-full max-w-7xl items-end justify-between px-5 pt-5 sm:px-10 sm:pt-7">
        <Logo withWordmark size={24} className="text-ink" />
        <span className="kicker !text-ink-faint">
          {LABEL[deck]} · {slide.beat ?? slide.section} · {String(pos.slide + 1).padStart(2, '0')}/
          {SLIDES.length}
        </span>
      </header>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div aria-hidden="true" className="rule-double mt-3 h-2" />
      </div>

      <main
        key={pos.slide}
        aria-live="polite"
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-y-auto px-5 py-6 sm:px-10 sm:py-10"
      >
        {slide.render(pos.build)}
      </main>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-4 text-[0.6875rem] text-ink-faint sm:px-10">
        <span>Colosseum · Identity &amp; Privacy</span>
        {timed ? (
          <span
            className={`font-mono text-xs ${over ? 'font-bold text-ember' : behind ? 'text-ember' : 'text-ink-soft'}`}
            title="Rehearsal clock: T to start, R to reset"
          >
            {startedAt === null ? 'T to start the clock' : `${clock(elapsed)} / ${clock(PITCH_SECONDS)}`}
            {startedAt !== null && ` · this slide by ${clock(dueBy)}`}
          </span>
        ) : (
          <span className="hidden sm:inline">← → to move · F fullscreen · N notes</span>
        )}
        <span className="flex gap-1" aria-hidden="true">
          {Array.from({ length: slide.builds + 1 }, (_, i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full ${i <= pos.build ? 'bg-brand' : 'bg-line'}`}
            />
          ))}
        </span>
      </footer>

      {notes && (
        <aside className="absolute inset-x-4 bottom-12 z-10 max-h-[40dvh] overflow-y-auto rounded-xl border border-line bg-paper-raised p-4 text-sm leading-relaxed text-ink-soft shadow-lg sm:inset-x-auto sm:right-6 sm:w-[28rem]">
          <p className="kicker mb-2">Presenter notes</p>
          {slide.notes}
        </aside>
      )}
    </div>
  );
}
