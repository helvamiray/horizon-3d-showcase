/**
 * SolutionPartners — "Çözüm Ortaklarımız"
 * ─────────────────────────────────────────────────────────────────────────
 * Dedicated section showing brand partner logos (text-based, terminal style).
 * Replaces the BrandTicker in the main layout.
 */

interface Partner {
  name: string;
  category: string;
  emoji: string;
}

const PARTNERS: Partner[] = [
  { name: "Daikin",              category: "VRF · Klima · Isı Pompası",  emoji: "❄️" },
  { name: "Mitsubishi Electric", category: "VRF · Klima Sistemleri",      emoji: "❄️" },
  { name: "Viessmann",           category: "Kazan · Isıtma",              emoji: "🔥" },
  { name: "Samsung",             category: "Isı Pompası · Klima",         emoji: "🌡️" },
  { name: "Wilo",                category: "Pompa Sistemleri",            emoji: "⚙️" },
  { name: "Grundfos",            category: "Endüstriyel Pompa",           emoji: "⚙️" },
  { name: "Danfoss",             category: "Kontrol & Vana",              emoji: "🔧" },
  { name: "Buderus",             category: "Kazan · Endüstriyel Isıtma",  emoji: "🔥" },
  { name: "Tyco",                category: "Yangın Söndürme",             emoji: "🧯" },
  { name: "Honeywell",           category: "Yangın Alarm",                emoji: "🧯" },
  { name: "CALEFFI",             category: "Hidrolik Sistem",             emoji: "💧" },
  { name: "FRANKISCHE",          category: "Boru Sistemleri",             emoji: "🔩" },
];

const SolutionPartners = () => {
  return (
    <section
      id="cozum-ortaklari"
      style={{
        background: "var(--terminal-surface,#080d14)",
        padding: "clamp(60px,10vw,100px) clamp(20px,6vw,80px)",
        borderTop:    "1px solid var(--terminal-border,rgba(0,240,255,0.1))",
        borderBottom: "1px solid var(--terminal-border,rgba(0,240,255,0.1))",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <p style={{
          fontFamily: "var(--font-premium-mono)", fontSize: "11px",
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "var(--electric-cyan,#00f0ff)", margin: "0 0 0.6rem",
        }}>
          // 05.SOLUTION PARTNERS
        </p>
        <h2 style={{
          fontFamily: "var(--font-premium-display)",
          fontSize: "clamp(24px,3vw,42px)", fontWeight: 800,
          color: "#fff", letterSpacing: "-0.02em", margin: "0 0 0.75rem",
        }}>
          Çözüm Ortaklarımız
        </h2>
        <p style={{
          fontFamily: "var(--font-premium-body)", fontSize: "14px",
          color: "rgba(255,255,255,0.38)", margin: "0 0 3rem", lineHeight: 1.6,
        }}>
          Dünya liderlerinin teknolojisini Türkiye'ye taşıyan yetkili iş ortaklarımız.
        </p>

        {/* Partner grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1px",
          border: "1px solid var(--terminal-border,rgba(0,240,255,0.08))",
          borderRadius: "6px",
          overflow: "hidden",
        }}>
          {PARTNERS.map((p, i) => (
            <div
              key={i}
              style={{
                background: "var(--terminal-bg,#020608)",
                padding: "1.4rem 1.5rem",
                borderRight:  "1px solid var(--terminal-border,rgba(0,240,255,0.08))",
                borderBottom: "1px solid var(--terminal-border,rgba(0,240,255,0.08))",
                transition: "background 180ms ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--terminal-surface,#080d14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--terminal-bg,#020608)";
              }}
            >
              {/* Index */}
              <span style={{
                position: "absolute", top: "10px", right: "12px",
                fontFamily: "var(--font-premium-mono)", fontSize: "9px",
                color: "rgba(255,255,255,0.1)", letterSpacing: "0.1em",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "1.4rem" }}>{p.emoji}</span>
                <span style={{
                  fontFamily: "var(--font-premium-display)", fontSize: "16px",
                  fontWeight: 700, color: "#fff", letterSpacing: "-0.01em",
                }}>
                  {p.name}
                </span>
              </div>
              <span style={{
                fontFamily: "var(--font-premium-mono)", fontSize: "10px",
                letterSpacing: "0.08em", color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
              }}>
                {p.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionPartners;
