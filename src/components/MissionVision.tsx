/**
 * MissionVision
 * ─────────────────────────────────────────────────────────────────────────
 * • Scroll-driven Framer Motion reading effect on each paragraph.
 *   Text fades in → stays → fades out, replaced by a radial aura glow.
 * • Circular looping video next to the text (muted, inline for iOS).
 * • No StatChip numbers at the bottom.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ABOUT_CIRCLE_VIDEO } from "@/constants/videoAssets";
import { useIsNarrowViewport } from "@/hooks/useIsNarrowViewport";

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
    <div ref={ref} style={{ position: "relative", minHeight: "96px" }}>
      <motion.p
        className="about-reading"
        style={{
          opacity: textOpacity,
          y: textY,
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
function ColHeader({
  line,
  label,
  variant,
}: {
  line: string;
  label: string;
  variant: "mission" | "vision";
}) {
  return (
    <div className={`about-col-header about-col-header--${variant}`}>
      <span
        className={`about-col-accent ${variant === "mission" ? "about-col-accent--cyan" : "about-col-accent--gold"}`}
        aria-hidden
      />
      <h3 className="about-col-label">{label}</h3>
      <span className="about-col-index">{line}</span>
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

/* ── Main component ─────────────────────────────────────────────── */
const MissionVision = () => {
  const narrow = useIsNarrowViewport();
  return (
    <section
      id="hakkimizda"
      className="about-section"
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)",
        borderTop:    "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
        borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <h2 className="about-hero-title">Hakkımızda</h2>

        <div className="about-section-inner">
          <div
            className="about-text"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            <div>
              <ColHeader line="01" label="Misyonumuz" variant="mission" />
              <ReadingPara text={MISSION} accentColor="var(--electric-cyan,#00f0ff)" />
            </div>
            <div>
              <ColHeader line="02" label="Vizyonumuz" variant="vision" />
              <ReadingPara text={VISION} accentColor="var(--gold,#c9a84c)" />
            </div>
          </div>

          <div className="about-video-circle">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload={narrow ? "none" : "metadata"}
              poster={ABOUT_CIRCLE_VIDEO.poster}
            >
              <source src={ABOUT_CIRCLE_VIDEO.mp4} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
