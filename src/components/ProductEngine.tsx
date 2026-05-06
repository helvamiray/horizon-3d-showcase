/**
 * ProductEngine
 * ─────────────────────────────────────────────────────────────────────────
 * Compact product grid with:
 *  • Category filter tabs + live search
 *  • Default card: category icon (large) + product name only
 *  • Hover/focus: slides in full description + specs + CTA
 *  • NO PRICE anywhere
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, CATEGORY_LABEL, type ProductCategory } from "@/data/products";

/* ── Category icons ─────────────────────────────────────────────── */
const CAT_ICON: Record<ProductCategory, string> = {
  "vrf":        "❄️",
  "isi-pompasi":"🌡️",
  "klima":      "💨",
  "kombi":      "🔥",
  "yangin":     "🧯",
  "tank":       "💧",
  "boru":       "⚙️",
  "radyator":   "♨️",
};

const ALL_CATS: { key: ProductCategory | "all"; label: string }[] = [
  { key: "all",        label: "Tümü"           },
  { key: "vrf",        label: "VRF"            },
  { key: "isi-pompasi",label: "Isı Pompası"    },
  { key: "klima",      label: "Klima"          },
  { key: "kombi",      label: "Kazan / Kombi"  },
  { key: "yangin",     label: "Yangın"         },
  { key: "tank",       label: "Tank"           },
  { key: "boru",       label: "Boru / Pompa"   },
];

/* ── Single product card ────────────────────────────────────────── */
function ProductCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  const [hovered, setHovered] = useState(false);
  const icon  = CAT_ICON[product.category] ?? "🔧";
  const label = CATEGORY_LABEL[product.category].tr;

  const open = () => window.open(`/urunler/${product.id}`, "_blank", "noopener,noreferrer");

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      aria-label={product.name}
      style={{
        position: "relative",
        background: hovered
          ? "var(--terminal-surface2, #0d1520)"
          : "var(--terminal-surface, #080d14)",
        border: `1px solid ${hovered ? "rgba(0,240,255,0.28)" : "var(--terminal-border, rgba(0,240,255,0.1))"}`,
        borderTop: "2px solid rgba(0,240,255,0.22)",
        borderRadius: "6px",
        padding: "1.4rem 1.25rem 1.25rem",
        cursor: "pointer",
        transition: "background 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        boxShadow: hovered ? "0 0 28px rgba(0,240,255,0.06)" : "none",
        overflow: "hidden",
        minHeight: "160px",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {/* Category badge */}
      <span style={{
        fontFamily: "var(--font-premium-mono)", fontSize: "9px",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--electric-cyan, #00f0ff)", opacity: 0.6,
      }}>
        {label}
      </span>

      {/* Icon — large when not hovered, smaller when hovered */}
      <div style={{
        fontSize: hovered ? "1.75rem" : "2.5rem",
        lineHeight: 1,
        transition: "font-size 220ms ease",
        userSelect: "none",
      }}>
        {icon}
      </div>

      {/* Product name — always visible */}
      <h3 style={{
        fontFamily: "var(--font-premium-display)",
        fontSize: "clamp(13px, 1.2vw, 15px)",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-0.01em",
        margin: 0,
        lineHeight: 1.3,
      }}>
        {product.name}
      </h3>

      {/* Reveal: description + first 2 specs + CTA — only when hovered */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <p style={{
              fontFamily: "var(--font-premium-body)", fontSize: "12px",
              color: "rgba(255,255,255,0.42)", lineHeight: 1.6, margin: 0,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {product.description}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
              {product.specs.slice(0, 2).map((s, i) => (
                <li key={i} style={{
                  fontFamily: "var(--font-premium-mono)", fontSize: "10px",
                  color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em",
                  display: "flex", alignItems: "center", gap: "5px",
                }}>
                  <span style={{ color: "var(--electric-cyan,#00f0ff)", opacity: 0.5 }}>—</span>
                  {s}
                </li>
              ))}
            </ul>

            <span style={{
              fontFamily: "var(--font-premium-mono)", fontSize: "10px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--electric-cyan, #00f0ff)", marginTop: "4px",
            }}>
              → Detayları Gör
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────── */
const ProductEngine = () => {
  const [activeCat, setActiveCat] = useState<ProductCategory | "all">("all");
  const [query,     setQuery]     = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const catMatch = activeCat === "all" || p.category === activeCat;
      const qMatch   = !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        CATEGORY_LABEL[p.category].tr.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
  }, [activeCat, query]);

  return (
    <section
      id="urunler"
      style={{
        background: "var(--terminal-bg, #020608)",
        padding: "clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)",
        position: "relative",
      }}
    >
      {/* Top accent line */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg,transparent,var(--electric-cyan,#00f0ff) 50%,transparent)",
        opacity: 0.3,
      }} />

      {/* Section header */}
      <div style={{ maxWidth: 1400, margin: "0 auto 2.5rem" }}>
        <p style={{
          fontFamily: "var(--font-premium-mono)", fontSize: "11px",
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "var(--electric-cyan,#00f0ff)", margin: "0 0 0.6rem",
        }}>
          // 04.PRODUCTS
        </p>
        <h2 style={{
          fontFamily: "var(--font-premium-display)",
          fontSize: "clamp(26px, 3.5vw, 48px)", fontWeight: 800,
          color: "#fff", letterSpacing: "-0.02em", margin: "0 0 2rem",
        }}>
          Ürün Kataloğu
        </h2>

        {/* Controls row */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: "160px" }}>
            <span style={{
              position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
              fontFamily: "var(--font-premium-mono)", fontSize: "12px",
              color: "var(--electric-cyan,#00f0ff)", opacity: 0.5, pointerEvents: "none",
            }}>›</span>
            <input
              type="search"
              placeholder="Ürün veya marka ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "var(--terminal-surface,#080d14)",
                border: "1px solid var(--terminal-border,rgba(0,240,255,0.12))",
                borderRadius: "4px",
                padding: "9px 12px 9px 26px",
                fontFamily: "var(--font-premium-mono)",
                fontSize: "12px", color: "#fff", outline: "none",
                transition: "border-color 200ms ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--electric-cyan,#00f0ff)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--terminal-border,rgba(0,240,255,0.12))")}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {ALL_CATS.map((cat) => {
              const active = activeCat === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCat(cat.key)}
                  style={{
                    fontFamily: "var(--font-premium-mono)", fontSize: "10px",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "6px 13px", borderRadius: "3px",
                    border: active ? "1px solid var(--electric-cyan,#00f0ff)" : "1px solid rgba(255,255,255,0.1)",
                    background: active ? "rgba(0,240,255,0.1)" : "transparent",
                    color: active ? "var(--electric-cyan,#00f0ff)" : "rgba(255,255,255,0.4)",
                    cursor: "pointer", transition: "all 160ms ease",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1rem",
      }}>
        {filtered.length === 0 && (
          <p style={{
            gridColumn: "1/-1", textAlign: "center",
            fontFamily: "var(--font-premium-mono)", fontSize: "12px",
            color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", padding: "4rem 0",
          }}>
            // Sonuç bulunamadı
          </p>
        )}
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
};

export default ProductEngine;
