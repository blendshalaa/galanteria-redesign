'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import language from '@/lang';
import { useLang } from '@/components/providers/LanguageProvider';

export default function AboutContent({ aboutText }) {
  const { lang, t } = useLang();

  const copy = language[lang]?.about?.[0] ?? {};

  /* The hero below is built entirely out of `position: absolute` elements
     (the circle, lamp, sofa and copy all sit on top of each other rather
     than in document flow), which throws off Next's own scroll-into-view on
     client-side navigation — it lands on the Mission & Vision section
     instead of the top of this page. The links that point here pass
     `scroll={false}` to opt out of that broken heuristic, and this is the
     scroll it was supposed to do instead. */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const intro =
    aboutText?.[lang]?.trim() ||
    copy.right2 ||
    '';

  const stats = [
    {
      value: '1000+',
      label: copy.left1,
    },
    {
      value: '200+',
      label: copy.left2,
    },
    {
      value: '15+',
      label: copy.left3,
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0d0c0b] text-[#f1eee9]">

      {/* =========================================================
          LARGE ORANGE CIRCLE
      ========================================================= */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[-19vw]
          top-[-31vw]
          z-0
          h-[64vw]
          w-[64vw]
          rounded-full
          bg-[#c87527]
          max-lg:hidden
        "
      />

      {/* =========================================================
          LAMP
      ========================================================= */}
      <img
        src="/images/lampa.png"
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[22%]
          top-[0%]
          z-20
          h-auto
          w-[18vw]
          max-w-[200px]
          min-w-[90px]
          origin-top
          object-contain
          animate-sway
          motion-reduce:animate-none
          max-lg:hidden
        "
      />

      {/* =========================================================
          LEFT SIDE — SOFA
      ========================================================= */}
      <img
        src="/images/sofa.png"
        alt=""
        className="
          pointer-events-none
          absolute
          bottom-[25%]
          left-[4%]
          z-20
          w-[55vw]
          max-w-[900px]
          min-w-[520px]
          object-contain
          max-lg:hidden
        "
      />

      {/* =========================================================
          RIGHT SIDE — CONTENT
      ========================================================= */}
      <div
        className="
          absolute
          right-[5%]
          top-[24%]
          z-30
          w-[35%]
          max-w-[600px]
          max-lg:hidden
        "
      >

        {/* WHO WE ARE */}
        <div className="mb-6 flex items-center gap-6">

          <span
            className="
              text-[12px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-[#c87527]
            "
          >
            Who we are
          </span>

          <span
            aria-hidden="true"
            className="
              h-px
              w-[70px]
              bg-[#c87527]
            "
          />

        </div>

        {/* TITLE */}
        <h1
          className="
            font-display
            text-[clamp(2.8rem,3.7vw,4.5rem)]
            font-light
            leading-[1]
            tracking-[-0.025em]
            text-[#f1eee9]
          "
        >
          {copy.right1 || 'Who we are'}
        </h1>

        {/* DESCRIPTION */}
        <p
          className="
            mt-8
            max-w-[590px]
            text-[clamp(0.95rem,1.05vw,1.2rem)]
            font-light
            leading-[1.75]
            text-[#a9a196]
          "
        >
          {intro}
        </p>

        {/* BUTTON */}
        <Link
          href="/Contact"
          className="
            group
            mt-8
            inline-flex
            items-center
            gap-3
            border
            border-[#c87527]
            bg-[#c87527]
            px-7
            py-3.5
            text-[13px]
            font-medium
            uppercase
            tracking-[0.08em]
            text-[#0d0c0b]
            transition-all
            duration-300
            hover:bg-transparent
            hover:text-[#c87527]
          "
        >
          {t('requestQuote')}

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

      </div>

      {/* =========================================================
          STATS — UNDER THE SOFA
      ========================================================= */}
      <div
        className="
          absolute
          bottom-[7%]
          left-[5%]
          z-30
          grid
          w-[48vw]
          max-w-[850px]
          grid-cols-3
          border-t
          border-[#3a3632]
          pt-5
          max-lg:hidden
        "
      >

        {stats.map((stat, index) => (
          <div
            key={stat.value}
            className={`
              flex flex-col items-center text-center
              ${index !== 0 ? 'border-l border-[#3a3632]' : ''}
            `}
          >

            <div
              className="
                font-display
                text-[clamp(1.8rem,2.3vw,2.8rem)]
                font-light
                leading-none
                text-[#c87527]
              "
            >
              <CountUpStat value={stat.value} />
            </div>

            <div
              className="
                mt-2
                text-[10px]
                font-medium
                uppercase
                tracking-[0.1em]
                text-[#8f8880]
              "
            >
              {stat.label}
            </div>

          </div>
        ))}

      </div>

      {/* =========================================================
          STACKED — phone and tablet both, now that the side-by-side
          layout above only takes over at `lg`. The circle/sofa are
          already sized in `vw`, so they scale on their own; `pt` is the
          one fixed-pixel value tuned for a phone, so it gets a wider
          `md:` companion for the tablet range this block now also covers.
      ========================================================= */}
      <div
        className="
          relative
          z-50
          block
          min-h-screen
          px-6
          pb-10
          pt-[430px]
          md:px-16
          md:pt-[58vw]
          lg:hidden
        "
      >

        {/* Mobile orange circle */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[-45vw]
            top-[-12vw]
            -z-10
            h-[90vw]
            w-[90vw]
            rounded-full
            bg-[#c87527]
          "
        />

        {/* Mobile lamp — hidden; the sofa alone sits in the circle here. */}
        <img
          src="/images/lampa.png"
          alt=""
          aria-hidden="true"
          className="
            hidden
            absolute
            left-[31%]
            top-[8%]
            z-10
            w-[22vw]
            max-w-[110px]
            origin-top
            object-contain
            animate-sway
            motion-reduce:animate-none
          "
        />

        {/* Mobile sofa */}
        <img
          src="/images/sofa.png"
          alt=""
          className="
            absolute
            left-[2%]
            top-[18%]
            z-20
            w-[96%]
            object-contain
          "
        />

        {/* Mobile content */}
        <div className="relative z-30">

          {/* WHO WE ARE */}
          <div className="mb-5 flex items-center gap-4">

            <span
              className="
                text-[11px]
                uppercase
                tracking-[0.2em]
                text-[#c87527]
              "
            >
              Who we are
            </span>

            <span
              aria-hidden="true"
              className="h-px w-12 bg-[#c87527]"
            />

          </div>

          {/* TITLE */}
          <h2
            className="
              font-display
              text-4xl
              font-light
              leading-tight
              text-[#f1eee9]
            "
          >
            {copy.right1 || 'Who we are'}
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-6
              max-w-[64ch]
              text-base
              leading-7
              text-[#a9a196]
            "
          >
            {intro}
          </p>

          {/* BUTTON */}
          <Link
            href="/Contact"
            className="
              mt-7
              inline-flex
              items-center
              gap-3
              bg-[#c87527]
              px-6
              py-3
              text-sm
              uppercase
              tracking-[0.08em]
              text-[#0d0c0b]
            "
          >
            {t('requestQuote')}
          </Link>

          {/* MOBILE STATS */}
          <div
            className="
              mt-10
              grid
              grid-cols-3
              border-t
              border-[#3a3632]
              pt-6
            "
          >

            {stats.map((stat, index) => (
              <div
                key={stat.value}
                className={
                  index !== 0
                    ? 'flex flex-col items-center border-l border-[#3a3632] text-center'
                    : 'flex flex-col items-center text-center'
                }
              >

                <div
                  className="
                    font-display
                    text-2xl
                    text-[#c87527]
                  "
                >
                  <CountUpStat value={stat.value} />
                </div>

                <div
                  className="
                    mt-2
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-[#8f8880]
                  "
                >
                  {stat.label}
                </div>

              </div>
            ))}

          </div>

        </div>
      </div>

    </section>
  );
}

/**
 * "1000+" counting up from 0 rather than sitting there as static text — the
 * only moving part this page had was the lamp. Starts once the stat scrolls
 * into view rather than on mount, since on the desktop layout all three sit
 * off-screen below the fold at page load.
 */
function CountUpStat({ value }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : '';

  const [display, setDisplay] = useState(target === null ? value : 0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (target === null || !ref.current) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      started.current = true;
      const frame = requestAnimationFrame(() => setDisplay(target));
      return () => cancelAnimationFrame(frame);
    }

    const node = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;

        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {target === null ? value : display}
      {suffix}
    </span>
  );
}