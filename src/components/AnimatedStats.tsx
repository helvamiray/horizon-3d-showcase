/**
 * AnimatedStats
 * ──────────────────────────────────────────────────────────────────────
 * Anime.js createTimer–driven counters.
 * Numbers count up with ease-out once the section enters the viewport.
 * Inspired by animejs.com's live timer demo.
 */
import { useEffect, useRef } from "react";
import { animate } from "animejs";

interface Stat {
  id: string;
  end: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
}

const STATS: Stat[] = [
  {
    id: "projects",
    end: 500,
    suffix: "+",
    label: "Tamamlanan",
    sublabel: "Proje",
    color: "var(--electric-cyan, #00f0ff)",
  },
  {
    id: "satisfaction",
    end: 98,
    suffix: "%",
    label: "Müşteri",
    sublabel: "Memnuniyeti",
    color: "var(--cyber-green, #00ff88)",
  },
  {
    id: "experience",
    end: 12,
    suffix: "+",
    label: "Yıl",
    sublabel: "Deneyim",
    color: "var(--gold, #c9a84c)",
  },
  {
    id: "team",
    end: 50,
    suffix: "+",
    label: "Uzman",
    sublabel: "Ekip",
    color: "#e07840",
  },
  {
    id: "sectors",
    end: 3,
    suffix: "",
    label: "Faaliyet",
    sublabel: "Sektörü",
    color: "rgba(255,255,255,0.75)",
  },
];

const AnimatedStats = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const started    = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const runCounters = () => {
      if (started.current) return;
      started.current = true;

      STATS.forEach((stat, i) => {
        const el = document.getElementById(`stat-num-${stat.id}`);
        if (!el) return;

        if (!motionOk) {
          el.textContent = stat.end + stat.suffix;
          return;
        }

        // Use animate() on a plain JS object — then read its value each frame
        const counter = { value: 0 };
        animate(counter, {
          value: stat.end,
          duration: 2200,
          delay: i * 120,          // stagger
          easing: "easeOutExpo",
          onUpdate: () => {
            el.textContent = Math.round(counter.value) + stat.suffix;
          },
          onComplete: () => {
            el.textContent = stat.end + stat.suffix; // clamp final value
          },
        });
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCounters();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--terminal-surface, #080d14)",
        borderTop:    "1px solid var(--terminal-border, rgba(0,240,255,0.1))",
        borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.1))",
        padding: "clamp(40px, 6vw, 72px) clamp(20px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glowing scan-line decoration */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, var(--electric-cyan,#00f0ff) 30%, var(--electric-cyan,#00f0ff) 70%, transparent 100%)",
          opacity: 0.04,
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0",
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            style={{
              padding: "clamp(20px, 3vw, 36px) clamp(16px, 2.5vw, 32px)",
              borderRight:
                i < STATS.length - 1
                  ? "1px solid var(--terminal-border, rgba(0,240,255,0.1))"
                  : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              position: "relative",
            }}
          >
            {/* Animated number */}
            <span
              id={`stat-num-${stat.id}`}
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "clamp(36px, 5vw, 68px)",
                fontWeight: 700,
                color: stat.color,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                textShadow: `0 0 28px ${stat.color}55`,
                tabularNums: "tabular-nums",
              } as React.CSSProperties}
            >
              0{stat.suffix}
            </span>

            {/* Label */}
            <span
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {stat.label}
              <br />
              <strong style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                {stat.sublabel}
              </strong>
            </span>

            {/* Accent dot */}
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: stat.color,
                boxShadow: `0 0 8px ${stat.color}`,
                marginTop: "4px",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnimatedStats;
