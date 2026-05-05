const BRANDS = [
  "Daikin", "Buderus", "Viessmann", "Tyco", "Caleffi",
  "Lowara", "Frankische", "Danfoss", "Honeywell", "Vaillant",
  "Kodsan", "Tanpera", "E.C.A", "Armas", "Wates",
];

const BrandSlider = () => {
  // Two copies for seamless loop
  const loop = [...BRANDS, ...BRANDS];
  return (
    <section
      aria-label="Partner markaları"
      style={{
        background: "var(--white)",
        borderTop: "1px solid rgba(10,22,40,0.06)",
        borderBottom: "1px solid rgba(10,22,40,0.06)",
        padding: "1.125rem 0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Fade masks */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, var(--white) 0%, transparent 8%, transparent 92%, var(--white) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div className="brand-marquee-track" aria-hidden="true">
        {loop.map((brand, i) => (
          <span key={`${brand}-${i}`} className="brand-marquee-item">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
};

export default BrandSlider;
