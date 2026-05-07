import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, spring } from "animejs";

gsap.registerPlugin(ScrollTrigger);

interface CardDef {
  slug: string;
  serialCode: string;
  label: string;
  category: string;
  spec: string;
  description: string;
  accentColor: string;
}

const CARDS: CardDef[] = [
  {
    slug: "p-ac-daikin",
    serialCode: "VGA-AC-2401",
    label: "Klima Sistemleri",
    category: "COOLING / AIR-CON",
    spec: "A+++ · 5–28 kW",
    description: "Inverter ve VRF teknolojisiyle bireysel, ofis ve endüstriyel mekânlar için hassas iklim yönetimi.",
    accentColor: "var(--electric-cyan, #00f0ff)",
  },
  {
    slug: "p-boiler-buderus",
    serialCode: "VGA-KZ-2401",
    label: "Kazan Sistemleri",
    category: "HEATING / BOILER",
    spec: "A+ · 24–500 kW",
    description: "Yoğuşmalı ve döküm kazanlar. Konut, hastane ve sanayi tesislerinde düşük emisyon, yüksek verim.",
    accentColor: "var(--gold, #c9a84c)",
  },
  {
    slug: "p-heatpump-daikin",
    serialCode: "VGA-IP-2401",
    label: "Isı Pompası",
    category: "HEAT PUMP / HVA",
    spec: "A+++ · COP 4.8",
    description: "Toprak ve hava kaynaklı ısı pompalarıyla hem ısıtma hem soğutma; yüzde 70'e varan enerji tasarrufu.",
    accentColor: "#e07840",
  },
  {
    slug: "p-fire-tyco",
    serialCode: "VGA-YG-2401",
    label: "Yangın Sistemleri",
    category: "FIRE SAFETY / FM",
    spec: "EN 54 · FM200",
    description: "Dedektörden söndürme sistemine kadar bütünleşik yangın güvenliği. ISO 9001 sertifikalı kurulum.",
    accentColor: "var(--alert-red, #ff3b55)",
  },
];

const ProductFour = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.querySelectorAll<HTMLElement>(".pf-card");

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 78%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (el: HTMLElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(el, { translateY: -6, scale: 1.015, easing: spring({ stiffness: 80, damping: 14 }) });
  };

  const handleMouseLeave = (el: HTMLElement) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(el, { translateY: 0, scale: 1, easing: spring({ stiffness: 80, damping: 12 }) });
  };

  return (
    <section
      id="urunler"
      ref={sectionRef}
      style={{
        background: "var(--terminal-bg, #020608)",
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative horizontal rule */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--electric-cyan, #00f0ff) 50%, transparent)",
          opacity: 0.3,
        }}
      />

      {/* Section header */}
      <div style={{ maxWidth: 1400, margin: "0 auto 3.5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-premium-mono)",
            fontSize: "11px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--electric-cyan, #00f0ff)",
            margin: "0 0 0.75rem",
          }}
        >
          // 04.PRODUCTS
        </p>
        <h2
          style={{
            fontFamily: "var(--font-premium-display)",
            fontSize: "clamp(28px, 3.5vw, 52px)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Çözümlerimiz
        </h2>
      </div>

      {/* Cards grid */}
      <div
        ref={cardsRef}
        className="pf-grid"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {CARDS.map((card) => (
          <div
            key={card.slug}
            className="pf-card"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              handleMouseEnter(el);
              el.style.borderColor = "var(--terminal-border-hover, rgba(0,240,255,0.35))";
              el.style.boxShadow   = "0 0 32px rgba(0,240,255,0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              handleMouseLeave(el);
              el.style.borderColor = "var(--terminal-border, rgba(0,240,255,0.12))";
              el.style.boxShadow   = "none";
            }}
            onClick={() => navigate({ to: "/urunler/$slug", params: { slug: card.slug } })}
            style={{
              position: "relative",
              background: "var(--terminal-surface, #080d14)",
              borderTop: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
              borderRight: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
              borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
              borderLeft: `3px solid ${card.accentColor}`,
              borderRadius: "8px",
              padding: "1.75rem 1.75rem 1.5rem",
              cursor: "pointer",
              transition: "border-color 240ms ease, box-shadow 240ms ease",
              overflow: "hidden",
            }}
          >
            {/* Serial number label */}
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-premium-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: "1rem",
              }}
            >
              SN: {card.serialCode}
            </span>

            {/* Category badge */}
            <span
              style={{
                display: "inline-block",
                fontFamily: "var(--font-premium-mono)",
                fontSize: "9px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: card.accentColor,
                border: `1px solid ${card.accentColor}`,
                borderRadius: "2px",
                padding: "2px 8px",
                marginBottom: "1rem",
                opacity: 0.85,
              }}
            >
              {card.category}
            </span>

            {/* Title */}
            <h3
              style={{
                fontFamily: "var(--font-premium-display)",
                fontSize: "clamp(18px, 1.8vw, 22px)",
                fontWeight: 700,
                color: "#ffffff",
                margin: "0 0 0.6rem",
                letterSpacing: "-0.01em",
              }}
            >
              {card.label}
            </h3>

            {/* Spec line */}
            <p
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "11px",
                color: card.accentColor,
                margin: "0 0 0.75rem",
                letterSpacing: "0.08em",
              }}
            >
              {card.spec}
            </p>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-premium-body)",
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7,
                margin: "0 0 1.5rem",
              }}
            >
              {card.description}
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: "/urunler/$slug", params: { slug: card.slug } });
              }}
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "10px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: card.accentColor,
                background: "transparent",
                border: `1px solid ${card.accentColor}`,
                borderRadius: "3px",
                padding: "7px 18px",
                cursor: "pointer",
                transition: "background 200ms ease, color 200ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = card.accentColor;
                (e.currentTarget as HTMLButtonElement).style.color = "#020608";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = card.accentColor;
              }}
            >
              → Detayları Gör
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFour;
