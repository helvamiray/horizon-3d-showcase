/**
 * MissionVision
 * ─────────────────────────────────────────────────────────────────────────
 * • Scroll-driven Framer Motion reading effect on each paragraph.
 *   Text fades in → stays → fades out, replaced by a radial aura glow.
 * • Circular looping video (vega_tanitim.mp4) shown next to the text.
 * • No StatChip numbers at the bottom.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Reading paragraph with Framer Motion scroll tracking ─────── */
interface ReadingParaProps {
  text: string;
  accentColor?: string;
}

function ReadingPara({ text, accentColor = "var(--electric-cyan,#00f0ff)" }: ReadingParaProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.2"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 1], [0, 1, 1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.15], [18, 0]);
  const auraOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const auraScale   = useTransform(scrollYProgress, [0.6, 1],    [0.8, 1.2]);

  return (
    <div ref={ref} style={{ position: "relative", minHeight: "80px" }}>
      <motion.p
        style={{
          opacity: textOpacity,
          y: textY,
          fontFamily: "var(--font-premium-body)",
          fontSize: "clamp(15px, 1.5vw, 18px)",
          lineHeight: 1.85,
          color: "rgba(255,255,255,0.78)",
          margin: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        {text}
      </motion.p>
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-20px -40px",
          opacity: auraOpacity,
          scale: auraScale,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 1,
          borderRadius: "50%",
          filter: "blur(12px)",
        }}
      />
    </div>
  );
}

/* ── Column header ─────────────────────────────────────────────── */
function ColHeader({ line, label, color }: { line: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
      <span style={{
        display: "inline-block", width: "32px", height: "2px",
        background: color, boxShadow: `0 0 8px ${color}`,
      }} />
      <h3 style={{
        fontFamily: "var(--font-premium-mono)", fontSize: "11px",
        letterSpacing: "0.2em", textTransform: "uppercase", color, margin: 0,
      }}>
        {label}
      </h3>
      <span style={{
        fontFamily: "var(--font-premium-mono)", fontSize: "9px",
        color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em",
      }}>
        {line}
      </span>
    </div>
  );
}

/* ── Content ───────────────────────────────────────────────────── */
const MISSION =
  "Vega İklimlendirme olarak, konut ve sanayiden hastanelere kadar her ölçekteki yapıyı " +
  "en verimli ısıtma ve soğutma çözümleriyle donatmayı misyon edindik. " +
  "Müşteri memnuniyetini, enerji verimliliğini ve uzun ömürlü mühendislik kalitesini " +
  "her projemizin temel ilkeleri olarak benimsiyoruz.";

const VISION =
  "2030 yılına kadar Türkiye'nin en güvenilir bölgesel iklim mühendisliği markası olmayı, " +
  "ısı pompası ve düşük karbonlu çözümler alanında sektörün referans noktasına ulaşmayı " +
  "ve 1 000 tamamlanan proje sınırını aşmayı hedefliyoruz.";

/* ── Circular video frame ──────────────────────────────────────── */
function CircularVideo() {
  return (
    <div
      style={{
        position: "relative",
        width: "clamp(180px, 22vw, 280px)",
        height: "clamp(180px, 22vw, 280px)",
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        border: "2px solid rgba(0,240,255,0.2)",
        boxShadow: "0 0 40px rgba(0,240,255,0.08), inset 0 0 30px rgba(0,0,0,0.5)",
        alignSelf: "center",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        src="/videos/vega_tanitim.mp4"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.85,
        }}
      />
      {/* Subtle overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 40%, rgba(8,13,20,0.55) 100%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
const MissionVision = () => {
  return (
    <section
      id="hakkimizda"
      style={{
        background: "var(--terminal-surface, #080d14)",
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
        borderTop:    "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
        borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
      }}
    >
      {/* Section tag */}
      <span aria-hidden="true" style={{
        position: "absolute", top: "24px", right: "clamp(20px,6vw,80px)",
        fontFamily: "var(--font-premium-mono)", fontSize: "11px",
        color: "rgba(0,240,255,0.18)", letterSpacing: "0.2em",
      }}>
        SECTION.02 · ABOUT
      </span>

      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <p style={{
          fontFamily: "var(--font-premium-mono)", fontSize: "11px",
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "var(--electric-cyan,#00f0ff)", margin: "0 0 0.75rem",
        }}>
          // 02.ABOUT
        </p>
        <h2 style={{
          fontFamily: "var(--font-premium-display)",
          fontSize: "clamp(28px,3.5vw,52px)", fontWeight: 800,
          color: "#fff", letterSpacing: "-0.02em", margin: "0 0 3.5rem",
        }}>
          Hakkımızda
        </h2>

        {/* Top layout: text columns + circular video */}
        <div style={{
          display: "flex",
          gap: "3rem",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}>
          {/* Left: mission + vision */}
          <div style={{
            flex: "1 1 320px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3.5rem",
          }}>
            <div>
              <ColHeader line="01" label="Misyonumuz" color="var(--electric-cyan,#00f0ff)" />
              <ReadingPara text={MISSION} accentColor="var(--electric-cyan,#00f0ff)" />
            </div>
            <div>
              <ColHeader line="02" label="Vizyonumuz" color="var(--gold,#c9a84c)" />
              <ReadingPara text={VISION} accentColor="var(--gold,#c9a84c)" />
            </div>
          </div>

          {/* Right: circular video */}
          <CircularVideo />
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
