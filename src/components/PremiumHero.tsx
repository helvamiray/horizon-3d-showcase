import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLanguage } from "@/i18n/LanguageContext";
import { PRODUCTS, CATEGORY_LABEL, type ProductCategory } from "@/data/products";
import { getCategoryRender } from "./ProductRenders";

// Category list shown in the hero strip + nav (matches reference image)
const HERO_CATEGORIES: { key: ProductCategory | "fancoil"; label: string; labelEn: string }[] = [
  { key: "klima",      label: "Klima",                    labelEn: "AC & Cooling" },
  { key: "fancoil",    label: "Fancoil",                  labelEn: "Fancoil" },
  { key: "isi-pompasi",label: "Isı Pompası",              labelEn: "Heat Pump" },
  { key: "kombi",      label: "Kazan",                    labelEn: "Boiler" },
  { key: "tank",       label: "Baylar ve Genleşme Tankı", labelEn: "Expansion Vessel" },
  { key: "boru",       label: "Pompa ve Hüloher",         labelEn: "Pumps" },
  { key: "yangin",     label: "Yangın Sistemi",           labelEn: "Fire Suppression" },
];

// Find the "secondary" category to peek in the bottom-right corner
function getSecondaryCategory(primary: string): string {
  const idx = HERO_CATEGORIES.findIndex((c) => c.key === primary);
  return HERO_CATEGORIES[(idx + 1) % HERO_CATEGORIES.length].key;
}

const PremiumHero = () => {
  const { lang } = useLanguage();
  const [activeCat, setActiveCat] = useState<string>("klima");
  const leftRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  const catInfo = HERO_CATEGORIES.find((c) => c.key === activeCat) ?? HERO_CATEGORIES[0];
  const label   = lang === "tr" ? catInfo.label : catInfo.labelEn;
  const product = PRODUCTS.find((p) => p.category === activeCat);
  const headline = product ? (lang === "tr" ? product.name : product.name_en) : label;
  const description = product
    ? (lang === "tr" ? product.description : product.description_en)
    : "";

  const secondaryCat = getSecondaryCategory(activeCat);
  const PrimaryRender   = getCategoryRender(activeCat);
  const SecondaryRender = getCategoryRender(secondaryCat);

  // Entrance animation on mount
  useEffect(() => {
    const el = leftRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-hero-in]"), {
        y: 32, opacity: 0, duration: 0.85, stagger: 0.1, ease: "power3.out", delay: 0.1,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Swap render with a quick fade
  const switchCategory = (cat: string) => {
    if (cat === activeCat) return;
    if (renderRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(renderRef.current, {
        opacity: 0, scale: 0.96, duration: 0.22, ease: "power2.in",
        onComplete: () => {
          setActiveCat(cat);
          gsap.to(renderRef.current!, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
        },
      });
    } else {
      setActiveCat(cat);
    }
  };

  return (
    <section
      style={{
        background: "#ffffff",
        minHeight: "100svh",
        paddingTop: "64px",     // clear fixed navbar
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      {/* ══════════ LEFT PANEL (50%) ══════════ */}
      <div
        ref={leftRef}
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "3rem 3.5rem 3rem 5vw",
          minWidth: 0,
        }}
        className="hero-left-panel"
      >
        {/* Eyebrow label */}
        <div
          data-hero-in
          style={{
            fontFamily: "var(--font-premium-mono)",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--navy-primary)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "28px",
              height: "1.5px",
              background: "var(--vega-cyan)",
            }}
          />
          3D DIGITAL TWIN &amp; INTEGRATIVE SYSTEMS
        </div>

        {/* Headline — product name */}
        <h1
          data-hero-in
          style={{
            fontFamily: "var(--font-premium-display)",
            fontWeight: 800,
            fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
            lineHeight: 1.1,
            color: "var(--navy-primary)",
            marginBottom: "1.25rem",
            maxWidth: "480px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {headline}
        </h1>

        {/* Category label badge */}
        <div
          data-hero-in
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.875rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: "var(--off-white)",
              border: "1px solid #e2e8f0",
              color: "var(--navy-primary)",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
            }}
          >
            {label}
          </span>
        </div>

        {/* Description */}
        <p
          data-hero-in
          style={{
            fontFamily: "var(--font-premium-body)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "#64748b",
            marginBottom: "2rem",
            maxWidth: "420px",
          }}
        >
          {description}
        </p>

        {/* CTA button */}
        <div data-hero-in style={{ display: "flex", gap: "0.875rem", marginBottom: "3rem" }}>
          <a
            href="#systems"
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "100px",
              background: "var(--navy-primary)",
              color: "#fff",
              fontFamily: "var(--font-premium-display)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.04em",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all var(--dur-med) var(--ease-premium)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--gold)";
              el.style.color = "var(--navy-deep)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--navy-primary)";
              el.style.color = "#fff";
            }}
          >
            Keşfet
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#quote"
            style={{
              padding: "0.75rem 1.75rem",
              borderRadius: "100px",
              border: "1.5px solid #e2e8f0",
              color: "var(--navy-primary)",
              fontFamily: "var(--font-premium-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "all var(--dur-fast) var(--ease-smooth)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--navy-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0";
            }}
          >
            Teklif Al
          </a>
        </div>

        {/* Category selector chips row */}
        <div data-hero-in>
          <div
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#94a3b8",
              marginBottom: "0.875rem",
            }}
          >
            Catalog
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {HERO_CATEGORIES.map((cat) => {
              const isActive = cat.key === activeCat;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => switchCategory(cat.key)}
                  style={{
                    padding: "0.4rem 0.875rem",
                    borderRadius: "100px",
                    border: isActive ? "1.5px solid var(--navy-primary)" : "1.5px solid #e2e8f0",
                    background: isActive ? "var(--navy-primary)" : "transparent",
                    color: isActive ? "#fff" : "#64748b",
                    fontFamily: "var(--font-premium-display)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.75rem",
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    transition: "all var(--dur-fast) var(--ease-smooth)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lang === "tr" ? cat.label : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL (50%) ══════════ */}
      <div
        style={{
          width: "50%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {/* Subtle background dot pattern */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />

        {/* Primary product render */}
        <div
          ref={renderRef}
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "min(460px, 90%)",
            width: "100%",
          }}
        >
          <PrimaryRender className="product-hero-image" />

          {/* Product badge label */}
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.375rem",
            }}
          >
            <span className="product-3d-badge">
              3D {label.toUpperCase()}
            </span>
            {product?.brand && (
              <span
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                  fontFamily: "var(--font-premium-mono)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.12em",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                }}
              >
                {product.brand}
              </span>
            )}
          </div>
        </div>

        {/* Secondary product — peeks from bottom-right corner */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-40px",
            right: "-40px",
            width: "38%",
            zIndex: 1,
            transform: "rotate(8deg)",
          }}
        >
          <SecondaryRender className="product-secondary-image" />
          <span
            className="product-3d-badge"
            style={{
              position: "absolute",
              bottom: "60px",
              left: "8px",
              fontSize: "9px",
              opacity: 0.8,
            }}
          >
            3D {HERO_CATEGORIES.find((c) => c.key === secondaryCat)?.label.toUpperCase() ?? ""}
          </span>
        </div>

        {/* Specs preview panel — floats top-left */}
        {product && (
          <div
            style={{
              position: "absolute",
              top: "2.5rem",
              left: "2rem",
              zIndex: 3,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "0.875rem 1.125rem",
              maxWidth: "200px",
              boxShadow: "0 8px 32px rgba(10,22,40,0.07)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: "0.5rem",
              }}
            >
              Teknik Özellikler
            </div>
            {(lang === "tr" ? product.specs : product.specs_en).slice(0, 3).map((s) => (
              <div
                key={s}
                style={{
                  fontFamily: "var(--font-premium-mono)",
                  fontSize: "0.6875rem",
                  color: "var(--navy-primary)",
                  lineHeight: 1.6,
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.375rem",
                }}
              >
                <span style={{ color: "var(--vega-cyan)", flexShrink: 0 }}>◆</span>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumHero;
