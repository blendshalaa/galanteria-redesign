'use client';

import { useEffect, useRef, useState } from 'react';

const COUNT_MS = 1500;

/**
 * Counts up to the value the server rendered, the first time it comes into
 * view, once.
 *
 * The rendered text starts at the final value, so the figure is correct with
 * JavaScript disabled and correct for anything reading the HTML; the animation
 * only ever replaces a number that is already there with the same number,
 * arrived at differently. Anything that is not a plain figure with a suffix —
 * and anyone who has asked for reduced motion — simply gets the value.
 */
export default function Counter({ value }) {
  const [shown, setShown] = useState(value);  
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const parts = /^(\d+)(\D*)$/.exec(value);
    if (!node || !parts) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const target = Number(parts[1]);
    const suffix = parts[2];
    let frame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now) => {
          const progress = Math.min(1, (now - start) / COUNT_MS);
          /* Ease out: most of the distance is covered early, so the last
             hundred tick over slowly instead of the whole run being linear. */
          const eased = 1 - (1 - progress) ** 3;
          setShown(`${Math.round(target * eased)}${suffix}`);
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  /* The final value is rendered underneath, invisible, purely to hold the width
     open. Without it the figure is two characters wide at the start of the
     count and five at the end, and the columns shuffle sideways for a second
     and a half while they run. */
  return (
    <span ref={ref} className="relative inline-block">
      <span className="invisible" aria-hidden="true">
        {value}
      </span>
      <span className="absolute inset-0 flex items-center justify-center">{shown}</span>
    </span>
  );
}
