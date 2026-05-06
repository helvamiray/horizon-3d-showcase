/**
 * IndustrialShowcase
 * ─────────────────────────────────────────────────────────────────────────
 * High-impact transition section between the project map and solution partners.
 * Two full-bleed headline blocks separated by a cyan gradient divider.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function ShowcaseBlock({
  tag,
  headline,
  sub,
  glowColor,
  align = "center",
}: {
  tag: string;
  headline: string;
  sub: string;
  glowColor: string;
  align?: "center" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y       = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="showcase-block"
      role="presentation"
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: "var(--font-premium-mono)",
          fontSize: "10px",
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: glowColor,
          opacity: 0.7,
          marginBottom: "1.25rem",
        }}
      >
        {tag}
      </span>

      <h2
        style={{
          fontFamily: "var(--font-premium-display)",
          fontSize: "clamp(28px, 4.5vw, 64px)",
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          color: "#ffffff",
          margin: "0 0 1.25rem",
          textAlign: align,
          textShadow: `0 0 48px ${glowColor}55, 0 0 120px ${glowColor}22`,
          maxWidth: "900px",
          marginInline: align === "center" ? "auto" : undefined,
        }}
      >
        {headline}
      </h2>

      <p
        style={{
          fontFamily: "var(--font-premium-body)",
          fontSize: "clamp(14px, 1.4vw, 17px)",
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.42)",
          maxWidth: "640px",
          marginInline: align === "center" ? "auto" : undefined,
          textAlign: align,
        }}
      >
        {sub}
      </p>
    </motion.div>
  );
}

const IndustrialShowcase = () => {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--terminal-bg, #020608)",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Block 1: Endüstriyel Çözümler ────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(72px, 12vw, 130px) clamp(24px, 8vw, 120px) clamp(60px, 9vw, 110px)",
          textAlign: "center",
        }}
      >
        <ShowcaseBlock
          tag="// ENDÜSTRİYEL ÇÖZÜMLER"
          headline="Sınırları Zorlayan Mühendislik, Kesintisiz Endüstriyel Güç."
          sub="Fabrikadan veri merkezine, hastaneden lojistik üssüne — her ölçekteki endüstriyel yapı için yüksek kapasiteli VRF, chiller ve yangın sistemleri."
          glowColor="var(--electric-cyan, #00f0ff)"
          align="center"
        />
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          zIndex: 1,
          height: "1px",
          margin: "0 clamp(24px, 8vw, 120px)",
          background:
            "linear-gradient(90deg, transparent 0%, var(--electric-cyan, #00f0ff) 30%, rgba(201,168,76,0.6) 70%, transparent 100%)",
          opacity: 0.35,
        }}
      />

      {/* ── Block 2: Kurumsal Çözümler ───────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(60px, 9vw, 110px) clamp(24px, 8vw, 120px) clamp(72px, 12vw, 130px)",
          textAlign: "center",
        }}
      >
        <ShowcaseBlock
          tag="// KURUMSAL ÇÖZÜMLER"
          headline="Geleceğin İş Dünyası İçin Akıllı İklimlendirme Mimarisi."
          sub="Ofis komplekslerinden AVM'lere, otellerden rezidanslara — enerji verimliliği ve konfor standartlarını bir arada sunan kurumsal iklim çözümleri."
          glowColor="var(--gold, #c9a84c)"
          align="center"
        />
      </div>

      {/* Bottom border */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--terminal-border, rgba(0,240,255,0.12)) 50%, transparent)",
          zIndex: 1,
        }}
      />
    </section>
  );
};

export default IndustrialShowcase;
