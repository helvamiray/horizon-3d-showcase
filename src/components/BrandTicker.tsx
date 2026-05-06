/**
 * BrandTicker — Framer Motion infinite horizontal brand scroll.
 * Brands loop seamlessly left-to-right. Terminal monospace style.
 */
import { motion } from "framer-motion";

const BRANDS = [
  "Daikin",
  "Mitsubishi Electric",
  "Viessmann",
  "Samsung",
  "Wilo",
  "Grundfos",
  "Danfoss",
];

/* Duplicate 4× for a seamless very long strip */
const ITEMS = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

const BrandTicker = () => {
  return (
    <div
      style={{
        background: "var(--terminal-surface, #080d14)",
        borderTop:    "1px solid var(--terminal-border, rgba(0,240,255,0.1))",
        borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.1))",
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fade edges */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, var(--terminal-surface,#080d14) 0%, transparent 8%, transparent 92%, var(--terminal-surface,#080d14) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{ display: "flex", gap: 0, width: "max-content" }}
        animate={{ x: "-50%" }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {ITEMS.map((brand, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "16px",
              padding: "0 28px",
              fontFamily: "var(--font-premium-mono)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {brand}
            <span
              aria-hidden="true"
              style={{ color: "var(--electric-cyan,#00f0ff)", opacity: 0.4, fontSize: "8px" }}
            >
              +
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default BrandTicker;
