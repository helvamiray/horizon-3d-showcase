/**
 * ProductSlider
 * ─────────────────────────────────────────────────────────────────────────
 * • Infinite auto-scroll from left to right (Framer Motion linear animation).
 * • Card: product image + category emoji + product name.
 * • Click → opens ProductModal with video BG, full specs, Add to Cart.
 * • Cart fully supports multiple different products + individual quantities.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ExternalLink } from "lucide-react";
import { PRODUCTS, CATEGORY_LABEL, type Product } from "@/data/products";
import { useCart } from "@/providers/CartContext";

/* ── Category emoji map ─────────────────────────────────────────── */
const CAT_EMOJI: Record<string, string> = {
  vrf:        "❄️",
  "isi-pompasi": "🌡️",
  klima:      "💨",
  kombi:      "🔥",
  yangin:     "🧯",
  tank:       "💧",
  boru:       "⚙️",
  radyator:   "♨️",
};

/* ── Product Modal ──────────────────────────────────────────────── */
function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty]     = useState(1);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const emoji = CAT_EMOJI[product.category] ?? "🔧";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px,4vw,48px)",
        background: "rgba(2,6,8,0.88)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Background video */}
      <video
        autoPlay muted loop playsInline
        src={product.video || "/videos/vega_tanitim.mp4"}
        style={{
          position: "absolute",
          inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.12, zIndex: 0,
        }}
      />

      {/* Modal panel */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 2,
          background: "rgba(8,13,20,0.97)",
          border: "1px solid rgba(0,240,255,0.2)",
          borderTop: "2px solid rgba(0,240,255,0.4)",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "2rem 2rem 1.75rem",
          boxShadow: "0 0 80px rgba(0,240,255,0.08)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Kapat"
          style={{
            position: "absolute", top: "16px", right: "16px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "4px", padding: "6px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.5)", transition: "all 180ms ease",
          }}
          onMouseEnter={(e) => { const b = e.currentTarget; b.style.background="rgba(255,255,255,0.12)"; b.style.color="#fff"; }}
          onMouseLeave={(e) => { const b = e.currentTarget; b.style.background="rgba(255,255,255,0.06)"; b.style.color="rgba(255,255,255,0.5)"; }}
        >
          <X size={16} />
        </button>

        {/* Product image */}
        {product.image && product.image !== "/placeholder.svg" && (
          <div style={{
            width: "100%", height: "200px", borderRadius: "6px",
            overflow: "hidden", marginBottom: "1.5rem",
            background: "rgba(0,0,0,0.4)",
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        {/* Emoji + category */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1.75rem" }}>{emoji}</span>
          <span style={{
            fontFamily: "var(--font-premium-mono)", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--electric-cyan,#00f0ff)", opacity: 0.7,
            border: "1px solid rgba(0,240,255,0.2)", borderRadius: "2px", padding: "2px 8px",
          }}>
            {CATEGORY_LABEL[product.category]?.tr ?? product.category}
          </span>
        </div>

        {/* Name + brand */}
        <h2 style={{
          fontFamily: "var(--font-premium-display)", fontSize: "clamp(18px,2vw,24px)",
          fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 4px",
        }}>
          {product.name}
        </h2>
        <p style={{
          fontFamily: "var(--font-premium-mono)", fontSize: "11px",
          color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em",
          textTransform: "uppercase", margin: "0 0 1.25rem",
        }}>
          {product.brand}
        </p>

        {/* Description */}
        <p style={{
          fontFamily: "var(--font-premium-body)", fontSize: "14px",
          color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 0 1.5rem",
        }}>
          {product.description}
        </p>

        {/* Specs */}
        <div style={{
          background: "rgba(0,240,255,0.03)",
          border: "1px solid rgba(0,240,255,0.1)",
          borderRadius: "6px", padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-premium-mono)", fontSize: "9px",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(0,240,255,0.5)", margin: "0 0 0.75rem",
          }}>
            TEKNİK ÖZELLİKLER
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "7px" }}>
            {product.specs.map((s, i) => (
              <li key={i} style={{
                fontFamily: "var(--font-premium-mono)", fontSize: "12px",
                color: "rgba(255,255,255,0.62)", letterSpacing: "0.04em",
                display: "flex", gap: "8px",
              }}>
                <span style={{ color: "var(--electric-cyan,#00f0ff)", opacity: 0.6, flexShrink: 0 }}>›</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Qty */}
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            style={{
              width: "64px",
              background: "var(--terminal-surface,#080d14)",
              border: "1px solid rgba(0,240,255,0.18)",
              borderRadius: "4px", padding: "9px 10px",
              fontFamily: "var(--font-premium-mono)", fontSize: "13px",
              color: "#fff", textAlign: "center", outline: "none",
            }}
          />

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            style={{
              flex: 1, minWidth: "140px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: added ? "rgba(0,255,136,0.12)" : "rgba(0,240,255,0.1)",
              border: `1px solid ${added ? "rgba(0,255,136,0.4)" : "rgba(0,240,255,0.3)"}`,
              borderRadius: "4px", padding: "10px 20px",
              fontFamily: "var(--font-premium-mono)", fontSize: "11px",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: added ? "var(--cyber-green,#00ff88)" : "var(--electric-cyan,#00f0ff)",
              cursor: "pointer", transition: "all 200ms ease",
            }}
          >
            <ShoppingCart size={15} />
            {added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
          </button>

          {/* Detail page */}
          <button
            onClick={() => window.open(`/urunler/${product.id}`, "_blank", "noopener,noreferrer")}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px", padding: "10px 16px",
              fontFamily: "var(--font-premium-mono)", fontSize: "10px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
              transition: "all 180ms ease",
            }}
            onMouseEnter={(e) => { const b = e.currentTarget; b.style.borderColor="rgba(255,255,255,0.3)"; b.style.color="rgba(255,255,255,0.7)"; }}
            onMouseLeave={(e) => { const b = e.currentTarget; b.style.borderColor="rgba(255,255,255,0.12)"; b.style.color="rgba(255,255,255,0.4)"; }}
          >
            <ExternalLink size={13} />
            Detay
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Slider card ────────────────────────────────────────────────── */
function SliderCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const emoji = CAT_EMOJI[product.category] ?? "🔧";
  const hasImg = product.image && product.image !== "/placeholder.svg";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={product.name}
      style={{
        flexShrink: 0,
        width: "220px",
        background: "var(--terminal-surface,#080d14)",
        border: "1px solid var(--terminal-border,rgba(0,240,255,0.1))",
        borderTop: "2px solid rgba(0,240,255,0.25)",
        borderRadius: "6px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(0,240,255,0.35)";
        el.style.boxShadow   = "0 0 24px rgba(0,240,255,0.07)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--terminal-border,rgba(0,240,255,0.1))";
        el.style.boxShadow   = "none";
      }}
    >
      {/* Image or emoji placeholder */}
      <div style={{
        height: "130px",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}>
        {hasImg ? (
          <img
            src={product.image}
            alt={product.name}
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: "3rem", userSelect: "none" }}>{emoji}</span>
        )}
      </div>

      {/* Text */}
      <div style={{ padding: "0.9rem 1rem 1rem" }}>
        <span style={{
          display: "block",
          fontFamily: "var(--font-premium-mono)", fontSize: "9px",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--electric-cyan,#00f0ff)", opacity: 0.6, marginBottom: "5px",
        }}>
          {emoji} {CATEGORY_LABEL[product.category]?.tr ?? product.category}
        </span>
        <p style={{
          fontFamily: "var(--font-premium-display)", fontSize: "13px",
          fontWeight: 700, color: "#fff",
          margin: 0, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>
      </div>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────── */
const ITEMS = [...PRODUCTS, ...PRODUCTS]; // double for seamless loop

const ProductSlider = () => {
  const [modal, setModal] = useState<Product | null>(null);

  return (
    <section
      style={{
        background: "var(--terminal-surface,#080d14)",
        padding: "clamp(48px,7vw,80px) 0",
        borderTop:    "1px solid var(--terminal-border,rgba(0,240,255,0.1))",
        borderBottom: "1px solid var(--terminal-border,rgba(0,240,255,0.1))",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Section label */}
      <div style={{
        padding: "0 clamp(20px,6vw,80px)",
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}>
        <p style={{
          fontFamily: "var(--font-premium-mono)", fontSize: "11px",
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "var(--electric-cyan,#00f0ff)", margin: 0,
        }}>
          // ÜRÜNLERİMİZ — Tüm kataloğu inceleyin
        </p>
      </div>

      {/* Fade edges */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "80px", zIndex: 2,
        background: "linear-gradient(to right, var(--terminal-surface,#080d14), transparent)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: "80px", zIndex: 2,
        background: "linear-gradient(to left, var(--terminal-surface,#080d14), transparent)",
        pointerEvents: "none",
      }} />

      {/* Infinite slider */}
      <div style={{ overflow: "hidden", paddingBottom: "8px" }}>
        <motion.div
          style={{
            display: "flex",
            gap: "14px",
            width: "max-content",
            paddingLeft: "clamp(20px,6vw,80px)",
          }}
          animate={{ x: [0, -(220 + 14) * PRODUCTS.length] }}
          transition={{
            duration: PRODUCTS.length * 4,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {ITEMS.map((product, i) => (
            <SliderCard
              key={`${product.id}-${i}`}
              product={product}
              onClick={() => setModal(product)}
            />
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProductModal product={modal} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductSlider;
