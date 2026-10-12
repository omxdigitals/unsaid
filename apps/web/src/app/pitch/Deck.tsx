'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/Logo';
import { SLIDES } from './slides';

/**
 * The deck engine. One slide at a time; each slide declares how many beats
 * ("builds") it has, and every click reveals the next one before the deck
 * moves on. The position lives in the URL hash as `#slide.build`, so a refresh
 * mid-pitch — or a link sent to a judge — lands on the same beat.
 *
 * Keys: → / Space / PageDown / click advance · ← / PageUp go back ·
 * F fullscreen · N presenter notes · Home / End jump.
 */

function parseHash(): { slide: number; build: number } {
  const match = /^#(\d+)(?:\.(\d+))?$/.exec(window.location.hash);
  if (!match) return { slide: 0, build: 0 };
  const slide = Math.min(Math.max(Number(match[1]) - 1, 0), SLIDES.length - 1);
  const build = Math.min(Number(match[2] ?? 0), SLIDES[slide]!.builds);
  return { slide, build };
}

export function Deck() {
  const [pos, setPos] = useState({ slide: 0, build: 0 });
  const [notes, setNotes] = useState(false);
  // The hash is read once on mount; until then, writing it back would clobber
  // the beat a shared link pointed at with the default `#1`.
  const [ready, setReady] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    setPos(parseHash());
    setReady(true);
    const onHash = () => setPos(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const hash = `#${pos.slide + 1}${pos.build ? `.${pos.build}` : ''}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [pos, ready]);

  const next = useCallback(() => {
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
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = SLIDES[pos.slide]!;
  const totalBeats = SLIDES.reduce((n, s) => n + s.builds + 1, 0);
  const beat = SLIDES.slice(0, pos.slide).reduce((n, s) => n + s.builds + 1, 0) + pos.build + 1;

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
          {slide.section} · {String(pos.slide + 1).padStart(2, '0')}/{SLIDES.length}
        </span>
      </header>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-10">
        <div aria-hidden="true" className="rule-double mt-3 h-2" />
      </div>

      <main
        key={pos.slide}
        aria-live="polite"
        className="mx-auto flex w-full max-w-7xl flex-1 animate-fade flex-col overflow-y-auto px-5 py-6 sm:px-10 sm:py-10"
      >
        {slide.render(pos.build)}
      </main>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-4 text-[0.6875rem] text-ink-faint sm:px-10">
        <span>Colosseum · Identity &amp; Privacy</span>
        <span className="hidden sm:inline">← → to move · F fullscreen · N notes</span>
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
