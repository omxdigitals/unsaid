'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Whether an element is on screen. Every looping scene on the site runs a
 * timer; without this, a long page keeps half a dozen of them ticking and
 * re-rendering off screen, which is most of the main-thread time a phone
 * spends on the landing page. Scenes pause when scrolled away and resume
 * where they were.
 *
 * Starts `false` so nothing animates before it is seen; `once` keeps it true
 * after the first sighting, for reveal-on-scroll.
 */
export function useInView<T extends Element>({
  rootMargin = '0px',
  once = false,
}: { rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry?.isIntersecting;
        setInView(visible);
        if (visible && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return [ref, inView] as const;
}
