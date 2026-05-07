/**
 * Solution partners — prestigious logo marquee (LTR), theme-aware.
 */

const PARTNER_NAMES = [
  "Daikin",
  "Mitsubishi Electric",
  "Viessmann",
  "Samsung",
  "Wilo",
  "Grundfos",
  "Danfoss",
  "Buderus",
  "Tyco",
  "Honeywell",
  "CALEFFI",
  "FRANKISCHE",
];

export function SolutionPartners() {
  const loop = [...PARTNER_NAMES, ...PARTNER_NAMES];

  return (
    <section
      id="cozum-ortaklari"
      className="solution-partners-section"
      aria-label="Stratejik çözüm ortakları"
    >
      <div className="solution-partners-inner">
        <p className="solution-partners-eyebrow">Çözüm Ortaklarımız</p>
        <h2 className="solution-partners-title">STRATEJİK ÇÖZÜM ORTAKLARIMIZ</h2>
        <p className="solution-partners-sub">
          Dünya liderlerinin teknolojisini Türkiye'ye taşıyan yetkili iş ortaklarımız.
        </p>

        <div className="solution-partners-marquee-mask">
          <div className="solution-partners-marquee-track">
            {loop.map((name, i) => (
              <div key={`${name}-${i}`} className="solution-partners-logo-cell">
                <span className="solution-partners-logo-text">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolutionPartners;
