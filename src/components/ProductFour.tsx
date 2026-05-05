import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { animate, spring } from "animejs";

gsap.registerPlugin(ScrollTrigger);

interface CardDef {
  slug: string;       // product ID in data layer
  emoji: string;
  label: string;
  description: string;
  accentColor: string;
}

const FOUR_CARDS: CardDef[] = [
  {
    slug: "p-ac-daikin",
    emoji: "❄️",
    label: "Klima",
    description:
      "Daikin VRF ve inverter split sistemler. Bölgesel soğutma, Wi-Fi kontrol, A+++ enerji sınıfı.",
    accentColor: "#00d4ff",
  },
  {
    slug: "p-boiler-buderus",
    emoji: "🔥",
    label: "Kazan",
    description:
      "Viessmann yoğuşmalı kombiler. %109'a kadar verim, Modbus uyumlu akıllı modülasyon.",
    accentColor: "#ffbf00",
  },
  {
    slug: "p-heatpump-daikin",
    emoji: "♨️",
    label: "Isı Pompası",
    description:
      "Grant Aerona3 R-32 havadan suya ısı pompaları. COP 5.1, A+++ sınıfı, ısıtma ve soğutma.",
    accentColor: "#00ff88",
  },
  {
    slug: "p-fire-tyco",
    emoji: "🚒",
    label: "Yangın Sistemi",
    description:
      "Tyco onaylı ABC tozlu söndürücüler. TS EN 3 sertifikalı, her sınıf yangına uygun.",
    accentColor: "#ff4040",
  },
];

const openProduct = (slug: string) =>
  window.open(`/urunler/${slug}`, "_blank", "noopener,noreferrer");

const ProductFour = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP stagger reveal on scroll
  useEffect(() => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!motionOk || !gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current!.querySelectorAll(".pf-card"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!motionOk) return;
    animate(e.currentTarget, {
      translateY: -10,
      duration: 360,
      ease: spring({ stiffness: 300, damping: 22 }),
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!motionOk) return;
    animate(e.currentTarget, {
      translateY: 0,
      duration: 440,
      ease: spring({ stiffness: 280, damping: 26 }),
    });
  };

  return (
    <section
      id="urunler"
      style={{
        background: "#ffffff",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{ marginBottom: "3rem", textAlign: "center" }}
          data-reveal
        >
          <span
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#94a3b8",
              display: "block",
              marginBottom: "12px",
            }}
          >
            Çözümlerimiz
          </span>
          <h2
            style={{
              fontFamily: "var(--font-premium-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "var(--navy-primary, #0a1628)",
              letterSpacing: "-0.025em",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Hangi Sistem Sizin İçin?
          </h2>
        </div>

        {/* 4-card grid */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
          className="pf-grid"
        >
          {FOUR_CARDS.map((card) => (
            <div
              key={card.slug}
              className="pf-card"
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(10,22,40,0.08)",
                borderRadius: "20px",
                padding: "2.25rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                willChange: "transform",
              }}
              onClick={() => openProduct(card.slug)}
            >
              {/* Top accent bar */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: card.accentColor,
                  borderRadius: "20px 20px 0 0",
                }}
              />

              {/* Emoji icon */}
              <span
                style={{ fontSize: "3rem", lineHeight: 1, display: "block" }}
                aria-hidden="true"
              >
                {card.emoji}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 800,
                  fontSize: "1.375rem",
                  color: "var(--navy-primary, #0a1628)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {card.label}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  color: "#64748b",
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                {card.description}
              </p>

              {/* CTA */}
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  padding: "8px 0",
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  color: card.accentColor,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                  transition: "gap 200ms ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openProduct(card.slug);
                }}
                aria-label={`${card.label} — Detayları Gör`}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.gap = "10px")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.gap = "6px")}
              >
                Detayları Gör
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 1024px) { .pf-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px)  { .pf-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

export default ProductFour;
