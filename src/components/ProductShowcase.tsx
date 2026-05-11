import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/i18n/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSection {
  id: string;
  reverse: boolean;
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  accentColor: string;
  borderAnimation: string;
  /** Static WebP — avoids multi‑MB MP4 on scroll sections */
  posterSrc: string;
  visualClass: string;
}

const SECTIONS: ShowcaseSection[] = [
  {
    id: "kazan",
    reverse: false,
    eyebrow: "01 — Kazan Dairesi",
    title: "Güvenilir ısınmanın mühendisliği",
    description:
      "Buderus, Vaillant ve E.C.A.'nın lider kombi ve kazan sistemleri. Yerden ısıtmadan radyatöre, komple kazan dairesi çözümleri tek çatı altında.",
    ctaHref: "#systems",
    accentColor: "var(--navy-primary)",
    borderAnimation: "none",
    posterSrc: "/img/plate-exchanger.webp",
    visualClass: "",
  },
  {
    id: "klima",
    reverse: true,
    eyebrow: "02 — Klima & Soğutma",
    title: "Konfor, hassasiyetle ayarlanmış",
    description:
      "Daikin inverter teknolojisi ile kış sıcak, yaz serin. VRF sistemlerden kaset tipi iç ünitelere, her ölçek için akıllı iklim çözümleri.",
    ctaHref: "#systems",
    accentColor: "var(--vega-cyan)",
    borderAnimation: "frost",
    posterSrc: "/img/mitsubishi-wall.webp",
    visualClass: "card-cooling",
  },
  {
    id: "yangin",
    reverse: false,
    eyebrow: "03 — Yangın Sistemleri",
    title: "Güvenlik, asla ödün vermez",
    description:
      "Tyco ve CALEFFI onaylı sprinkler, boru hatları ve baskı regülatörleri. NFPA 13 uyumlu, her ölçekteki projede hayat kurtaran sistemler.",
    ctaHref: "#systems",
    accentColor: "var(--cat-fire)",
    borderAnimation: "fire",
    posterSrc: "/img/fire-valve.webp",
    visualClass: "fire-glow",
  },
  {
    id: "heatpump",
    reverse: true,
    eyebrow: "04 — Isı Pompası",
    title: "Yenilenebilir ısı, sonsuz konfor",
    description:
      "Grant ve Daikin havadan-suya ısı pompalarıyla enerji faturanızı %65'e kadar düşürün. A+++ sınıfı, R-32 soğutucu akışkan, akıllı kontrol.",
    ctaHref: "#systems",
    accentColor: "var(--gold)",
    borderAnimation: "pendulum",
    posterSrc: "/img/heat-pump.webp",
    visualClass: "heatpump-pendulum",
  },
];

const ShowcaseItem = ({ s, isFirst }: { s: ShowcaseSection; isFirst: boolean }) => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const visualRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const textEl = textRef.current;
    const visualEl = visualRef.current;
    if (!el || !textEl || !visualEl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Pin + parallax on the visual
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=100%",
        pin: true,
        anticipatePin: 1,
        scrub: 1,
      });

      gsap.from(textEl.querySelectorAll<HTMLElement>("[data-text-reveal]"), {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      id={`showcase-${s.id}`}
      className={`product-scene${s.reverse ? " reverse" : ""}`}
    >
      {/* Text panel */}
      <div className="product-scene-text" ref={textRef}>
        <div style={{ maxWidth: "400px" }}>
          <div
            data-text-reveal
            className="section-eyebrow"
            style={{ marginBottom: "1rem" }}
          >
            {s.eyebrow}
          </div>
          <h2
            data-text-reveal
            className="section-headline"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              marginBottom: "1.25rem",
            }}
          >
            {s.title}
          </h2>
          <p
            data-text-reveal
            style={{
              fontFamily: "var(--font-premium-body)",
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "#4a5a6a",
              marginBottom: "2rem",
            }}
          >
            {s.description}
          </p>
          <a
            data-text-reveal
            href={s.ctaHref}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.75rem",
              borderRadius: "8px",
              border: `2px solid ${s.accentColor}`,
              color: s.accentColor,
              fontFamily: "var(--font-premium-display)",
              fontWeight: 700,
              fontSize: "0.8125rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all var(--dur-med) var(--ease-premium)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = s.accentColor;
              el.style.color = s.accentColor === "var(--gold)" ? "var(--navy-deep)" : "#fff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "transparent";
              el.style.color = s.accentColor;
            }}
          >
            {t("card.specs")} →
          </a>
        </div>
      </div>

      {/* Visual panel */}
      <div
        className="product-scene-visual"
        ref={visualRef}
        style={{
          background: "var(--navy-deep)",
          borderLeft: s.reverse ? "none" : `3px solid ${s.accentColor}`,
          borderRight: s.reverse ? `3px solid ${s.accentColor}` : "none",
        }}
      >
        <div
          className={s.visualClass}
          style={{
            position: "absolute",
            inset: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={s.posterSrc}
            alt=""
            decoding="async"
            loading={isFirst ? "eager" : "lazy"}
            fetchPriority={isFirst ? "high" : "low"}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "12px",
              opacity: 0.85,
            }}
          />
        </div>
        {/* Colour-keyed accent overlay at bottom */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: `linear-gradient(to top, ${s.accentColor}22, transparent)`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

const ProductShowcase = () => (
  <section id="product-showcase">
    {SECTIONS.map((s, i) => (
      <ShowcaseItem key={s.id} s={s} isFirst={i === 0} />
    ))}
  </section>
);

export default ProductShowcase;
