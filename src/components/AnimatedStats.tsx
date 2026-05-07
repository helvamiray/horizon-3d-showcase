/**
 * AnimatedStats
 * ──────────────────────────────────────────────────────────────────────
 * Premium trust-metrics band: glass cards, subtle accents, GSAP count-up +
 * staggered fade-up on viewport entry.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useLanguage } from "@/i18n/LanguageContext";
import type { TKey } from "@/i18n/translations";

type StatTone = "cyan" | "emerald" | "amber" | "coral" | "slate";

interface Stat {
  id: string;
  end: number;
  suffix: string;
  labelKey: TKey;
  tone: StatTone;
}

const STATS: Stat[] = [
  {
    id: "projects",
    end: 500,
    suffix: "+",
    labelKey: "stats.metric.projects",
    tone: "cyan",
  },
  {
    id: "satisfaction",
    end: 98,
    suffix: "%",
    labelKey: "stats.metric.satisfaction",
    tone: "emerald",
  },
  {
    id: "experience",
    end: 12,
    suffix: "+",
    labelKey: "stats.metric.experience",
    tone: "amber",
  },
  {
    id: "team",
    end: 50,
    suffix: "+",
    labelKey: "stats.metric.team",
    tone: "coral",
  },
  {
    id: "sectors",
    end: 3,
    suffix: "",
    labelKey: "stats.metric.sectors",
    tone: "slate",
  },
];

export function AnimatedStats() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const started = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (started.current) return;
      started.current = true;

      STATS.forEach((stat, i) => {
        const numEl = numRefs.current[i];
        const cardEl = cardRefs.current[i];
        if (!numEl || !cardEl) return;

        if (!motionOk) {
          gsap.set(cardEl, { y: 0, opacity: 1 });
          numEl.textContent = stat.end + stat.suffix;
          return;
        }

        const counter = { v: 0 };
        const tl = gsap.timeline({ delay: i * 0.08, defaults: { ease: "power3.out" } });

        gsap.set(cardEl, { y: 36, opacity: 0 });
        numEl.textContent = `0${stat.suffix}`;

        tl.to(cardEl, {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: "power3.out",
        }).to(
          counter,
          {
            v: stat.end,
            duration: 1.85,
            ease: "power2.out",
            onUpdate: () => {
              numEl.textContent = Math.round(counter.v) + stat.suffix;
            },
            onComplete: () => {
              numEl.textContent = stat.end + stat.suffix;
            },
          },
          "-=0.42",
        );
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="animated-stats-section"
      aria-labelledby="trust-stats-heading"
    >
      <div className="animated-stats-section__ambient" aria-hidden>
        <span className="animated-stats-section__orb animated-stats-section__orb--1" />
        <span className="animated-stats-section__orb animated-stats-section__orb--2" />
        <span className="animated-stats-section__orb animated-stats-section__orb--3" />
      </div>

      <div className="animated-stats-section__inner">
        <header className="animated-stats-section__header">
          <h2 id="trust-stats-heading" className="animated-stats-section__title">
            {t("stats.section.title")}
          </h2>
          <p className="animated-stats-section__subtitle">{t("stats.section.subtitle")}</p>
        </header>

        <ul className="animated-stats-section__grid">
          {STATS.map((stat, i) => (
            <li key={stat.id}>
              <article
                className={`animated-stats-card animated-stats-card--${stat.tone}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                aria-label={`${t(stat.labelKey)}, ${stat.end}${stat.suffix}`}
              >
                <span
                  ref={(el) => {
                    numRefs.current[i] = el;
                  }}
                  id={`stat-num-${stat.id}`}
                  className="animated-stats-card__value"
                  aria-hidden="true"
                >
                  0{stat.suffix}
                </span>
                <p className="animated-stats-card__label">{t(stat.labelKey)}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
