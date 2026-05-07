/**
 * ProductSlider
 * ─────────────────────────────────────────────────────────────────────────
 * • Infinite auto-scroll from left to right (Framer Motion linear animation).
 * • Card: product image + category label + product name.
 * • Click → opens ProductModal with video BG, full specs, Add to Cart.
 * • Cart fully supports multiple different products + individual quantities.
 */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ExternalLink, Package } from "lucide-react";
import { PRODUCTS, CATEGORY_LABEL, type Product } from "@/data/products";
import { useCart } from "@/providers/CartContext";
import { HERO_VEGA_VIDEO } from "@/constants/videoAssets";

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [qty, setQty]     = useState(1);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const modalPoster =
    product.image && product.image !== "/placeholder.svg"
      ? product.image
      : HERO_VEGA_VIDEO.poster;
  const modalVideoSrc = product.video || HERO_VEGA_VIDEO.mp4;

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
        width: "100%",
        minHeight: "100dvh",
        zIndex: 10500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px,4vw,48px)",
        background: "rgba(2,6,8,0.88)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Background video (muted, inline playback for iOS) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={modalPoster}
        style={{
          position: "absolute",
          inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.12, zIndex: 0,
        }}
      >
        <source src={modalVideoSrc} type="video/mp4" />
      </video>

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
          borderTop: "2px solid rgba(0,240,255,0.4)",
          borderRight: "1px solid rgba(0,240,255,0.2)",
          borderBottom: "1px solid rgba(0,240,255,0.2)",
          borderLeft: "1px solid rgba(0,240,255,0.2)",
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

        {/* Category */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{
            fontFamily: "var(--font-premium-mono)", fontSize: "10px",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--electric-cyan,#00f0ff)", opacity: 0.7,
            border: "1px solid rgba(0,240,255,0.2)", borderRadius: "2px", padding: "2px 8px",
            display: "inline-block",
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
            {added ? "Sepete eklendi" : "Sepete Ekle"}
          </button>

          {/* Detail page */}
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate({ to: "/urunler/$slug", params: { slug: product.id } });
            }}
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
  const hasImg = product.image && product.image !== "/placeholder.svg";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={product.name}
      className="product-slider-card"
    >
      <div className="product-slider-card__media">
        {hasImg ? (
          <img
            src={product.image}
            alt={product.name}
            draggable={false}
          />
        ) : (
          <Package size={40} strokeWidth={1.25} aria-hidden className="product-slider-card__placeholder" />
        )}
      </div>

      <div className="product-slider-card__body">
        <span className="product-slider-card__category">
          {CATEGORY_LABEL[product.category]?.tr ?? product.category}
        </span>
        <p className="product-slider-card__title">
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

  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modal]);

  return (
    <>
      <section className="product-slider-section">
        <div className="product-slider-fade product-slider-fade--left" aria-hidden />
        <div className="product-slider-fade product-slider-fade--right" aria-hidden />

        <div className="product-slider-viewport">
          <motion.div
            className="product-slider-track"
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
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {modal ? (
                <ProductModal
                  key={modal.id}
                  product={modal}
                  onClose={() => setModal(null)}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
};

export default ProductSlider;
