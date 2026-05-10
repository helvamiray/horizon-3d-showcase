/**
 * MissionVision — Hakkımızda / Misyon / Vizyon
 * Statik grid: sol metin sütunları; sağda altın çerçeveli Mitsubishi görseli.
 */
const ABOUT_CIRCLE_IMAGE_URL =
  "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778242879/mitsubishi-wall_yht5es.png";

function ColHeader({
  label,
  variant,
}: {
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
    </div>
  );
}

const MissionVision = () => (
  <section id="hakkimizda" className="about-section">
    <div
      className="about-section-panel bg-neutral-950"
      style={{
        padding: "clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)",
        borderTop: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
        borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <h2 className="about-hero-title text-neutral-50 dark:text-white">Hakkımızda</h2>

        <div className="about-section-inner">
          <div className="about-text min-w-0 flex-1">
            <div className="mx-auto w-full max-w-4xl dark:text-white">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "clamp(2.5rem, 5vw, 4rem)",
                }}
              >
                <div>
                  <ColHeader label="MİSYONUMUZ" variant="mission" />
                  <p className="about-reading text-neutral-400">
                    Vega İklimlendirme olarak, konut ve sanayiden hastanelere kadar her ölçekteki
                    yapıyı en verimli ısıtma ve soğutma çözümleriyle donatmayı misyon edindik.
                    Müşteri memnuniyetini, enerji verimliliğini ve uzun ömürlü mühendislik kalitesini
                    her projemizin temel ilkeleri olarak benimsiyoruz.
                  </p>
                </div>
                <div>
                  <ColHeader label="VİZYONUMUZ" variant="vision" />
                  <p className="about-reading text-neutral-400">
                    2030 yılına kadar Türkiye&apos;nin en güvenilir bölgesel iklim mühendisliği markası
                    olmayı, ısı pompası ve düşük karbonlu çözümler alanında sektörün referans
                    noktasına ulaşmayı ve 1 000 tamamlanan proje sınırını aşmayı hedefliyoruz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-video-circle shrink-0 max-[768px]:mx-auto">
            <img src={ABOUT_CIRCLE_IMAGE_URL} alt="" decoding="async" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default MissionVision;
