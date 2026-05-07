import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { animate, spring } from "animejs";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { PRODUCTS, type Product, CATEGORY_LABEL } from "@/data/products";
import { useCart } from "@/providers/CartContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme, type ProductTheme } from "@/context/ThemeContext";
import Mini3DPreview from "@/components/Mini3DPreview";
import { getCategoryRender } from "@/components/ProductRenders";

const THEME_MAP: Record<string, ProductTheme> = {
  "isi-pompasi": "heatpump",
  klima:         "cooling",
  yangin:        "fire",
  kombi:         "boiler",
  radyator:      "heating",
  tank:          "default",
  boru:          "heating",
};

const ProductSwap = () => {
  const [selected, setSelected] = useState<Product>(PRODUCTS[0]);
  const { add, openCart } = useCart();
  const { lang } = useLanguage();
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  const centerRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const name  = lang === "tr" ? selected.name     : selected.name_en;
  const specs = (lang === "tr" ? selected.specs    : selected.specs_en).slice(0, 4);
  const label = CATEGORY_LABEL[selected.category][lang];

  const switchProduct = (p: Product) => {
    if (p.id === selected.id) return;
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (motionOk && centerRef.current) {
      animate(centerRef.current, {
        opacity: [1, 0],
        scale: [1, 0.88],
        duration: 180,
        ease: spring({ stiffness: 280, damping: 20 }),
        onComplete: () => {
          setSelected(p);
          setTheme(THEME_MAP[p.category] ?? "default");
          animate(centerRef.current!, {
            opacity: [0, 1],
            scale: [0.88, 1],
            duration: 300,
            ease: spring({ stiffness: 320, damping: 22 }),
          });
        },
      });

      if (specsRef.current) {
        animate(Array.from(specsRef.current.children), {
          translateX: [-24, 0],
          opacity: [0, 1],
          delay: (_el: Element, i: number) => i * 55,
          duration: 380,
          ease: spring({ stiffness: 300, damping: 24 }),
        });
      }
    } else {
      setSelected(p);
      setTheme(THEME_MAP[p.category] ?? "default");
    }
  };

  const handleAdd = () => {
    add(selected);
    setTimeout(openCart, 350);

    if (addBtnRef.current) {
      const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (motionOk) {
        animate(addBtnRef.current, {
          scale: [1, 0.92, 1.06, 1],
          duration: 500,
          ease: spring({ stiffness: 400, damping: 18 }),
        });
      }
    }
  };

  // Initial stagger reveal for category pills
  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) return;
    const pills = document.querySelectorAll(".swap-pill");
    animate(pills, {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: (_el: Element, i: number) => 120 + i * 60,
      duration: 420,
      ease: spring({ stiffness: 280, damping: 22 }),
    });
  }, []);

  const RenderSVG = getCategoryRender(selected.category);

  return (
    <section
      id="urunler"
      style={{
        background: "#ffffff",
        padding: "4rem 1.5rem",
        borderTop: "1px solid #f1f5f9",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Section header */}
        <div
          style={{ textAlign: "center", marginBottom: "2.5rem" }}
          data-reveal
        >
          <span
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--vega-cyan)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Ürün Kataloğu
          </span>
          <h2
            className="section-headline"
            style={{
              fontFamily: "var(--font-premium-display)",
              fontWeight: 800,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "var(--navy-primary)",
              margin: 0,
            }}
          >
            Sisteminizi Seçin
          </h2>
        </div>

        {/* Category pill row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.625rem",
            marginBottom: "2.5rem",
          }}
        >
          {PRODUCTS.map((p) => (
            <button
              key={p.id}
              className={`swap-pill${selected.id === p.id ? " active" : ""}`}
              onClick={() => switchProduct(p)}
              aria-pressed={selected.id === p.id}
              aria-label={lang === "tr" ? p.name : p.name_en}
            >
              {CATEGORY_LABEL[p.category][lang]}
            </button>
          ))}
        </div>

        {/* Main swap area: 3D center + specs */}
        <div className="swap-stage">
          {/* Center: 3D or SVG preview */}
          <div ref={centerRef} className="swap-center" aria-live="polite">
            <div className="swap-3d-wrap" aria-label={name}>
              {selected.preview3d ? (
                <Mini3DPreview kind={selected.preview3d} spinning />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5rem",
                  }}
                >
                  <RenderSVG
                    style={{ width: "80%", height: "80%", maxHeight: "220px" }}
                  />
                </div>
              )}
            </div>
            <div className="swap-badge">{label}</div>
          </div>

          {/* Right: product info */}
          <div className="swap-info">
            <div
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "0.625rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: "0.5rem",
              }}
            >
              {selected.brand}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-premium-display)",
                fontWeight: 800,
                fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                color: "var(--navy-primary)",
                lineHeight: 1.2,
                marginBottom: "1rem",
              }}
            >
              {name}
            </h3>

            {/* Specs */}
            <div ref={specsRef} className="swap-specs">
              {specs.map((s, i) => (
                <div key={i} className="swap-spec-row">
                  <span className="swap-spec-bullet" aria-hidden="true">
                    ·
                  </span>
                  <span className="swap-spec-text">{s}</span>
                </div>
              ))}
            </div>


            {/* Action row */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                ref={addBtnRef}
                className="swap-btn-add"
                onClick={handleAdd}
                aria-label={`${name} — Sepete Ekle`}
              >
                <ShoppingCart size={15} aria-hidden="true" />
                Sepete Ekle
              </button>
              <button
                className="swap-btn-detail"
                onClick={() =>
                  navigate({
                    to: "/urunler/$slug",
                    params: { slug: selected.id },
                  })
                }
                aria-label={`${name} — Detaylar`}
              >
                Detaylar
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSwap;
