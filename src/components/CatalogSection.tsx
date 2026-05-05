import { useNavigate } from "@tanstack/react-router";
import { getCategoryRender } from "./ProductRenders";
import { useLanguage } from "@/i18n/LanguageContext";
import { useTheme, type ProductTheme } from "@/context/ThemeContext";

interface CatalogItem {
  key: string;
  emoji: string;
  label: string;
  labelEn: string;
  desc: string;
  descEn: string;
  theme: ProductTheme;
  productId: string;
}

const CATALOG_ITEMS: CatalogItem[] = [
  {
    key: "klima",
    emoji: "❄️",
    label: "Klima",
    labelEn: "AC & Cooling",
    desc: "Daikin VRF ve inverter duvar tipi split klima sistemleri. A+++ enerji sınıfı, Wi-Fi kontrol.",
    descEn: "Daikin VRF and inverter wall-mounted split AC systems. A+++ energy class, Wi-Fi control.",
    theme: "cooling",
    productId: "p-ac-daikin",
  },
  {
    key: "fancoil",
    emoji: "💨",
    label: "Fancoil",
    labelEn: "Fancoil",
    desc: "Daikin gizli tavan tipi ve konsol fancoil üniteleri. Sessiz çalışma, 2/4 borulu.",
    descEn: "Daikin concealed ceiling and console fancoil units. Silent operation, 2/4 pipe.",
    theme: "cooling",
    productId: "p-ac-daikin",
  },
  {
    key: "isi-pompasi",
    emoji: "♨️",
    label: "Isı Pompası",
    labelEn: "Heat Pump",
    desc: "Grant Aerona3 R-32 havadan suya ısı pompaları. COP 5.1'e kadar, A+++ sınıfı.",
    descEn: "Grant Aerona3 R-32 air-to-water heat pumps. Up to COP 5.1, A+++ class.",
    theme: "heatpump",
    productId: "p-heatpump-daikin",
  },
  {
    key: "kombi",
    emoji: "🔥",
    label: "Kazan",
    labelEn: "Boiler",
    desc: "Viessmann ve Buderus yoğuşmalı kombiler. %109'a kadar verim, Modbus uyumlu.",
    descEn: "Viessmann & Buderus condensing boilers. Up to 109% efficiency, Modbus compatible.",
    theme: "boiler",
    productId: "p-boiler-buderus",
  },
  {
    key: "tank",
    emoji: "💧",
    label: "Baylar ve Genleşme Tankı",
    labelEn: "Expansion Vessel",
    desc: "KODSAN paslanmaz tampon ve sıcak kullanım suyu tankları. AISI 316, solar serpantin.",
    descEn: "KODSAN stainless buffer and DHW tanks. AISI 316 inner shell, solar coil.",
    theme: "default",
    productId: "p-tank-kodsan",
  },
  {
    key: "boru",
    emoji: "⚡",
    label: "Pompa ve Hüloher",
    labelEn: "Pumps & Pipes",
    desc: "LOWARA ErP-A sirkülasyon pompaları ve FRANKISCHE PEX-A yerden ısıtma boru sistemleri.",
    descEn: "LOWARA ErP-A circulation pumps and FRANKISCHE PEX-A underfloor heating pipes.",
    theme: "heating",
    productId: "p-pipe-frankische",
  },
  {
    key: "yangin",
    emoji: "🚒",
    label: "Yangın Söndürme",
    labelEn: "Fire Suppression",
    desc: "Tyco onaylı ABC kuru kimyevi tozlu söndürücüler. TS EN 3 sertifikalı, tüm sınıflar.",
    descEn: "Tyco approved ABC dry-powder extinguishers. TS EN 3 certified, all fire classes.",
    theme: "fire",
    productId: "p-fire-tyco",
  },
  {
    key: "radyator",
    emoji: "🌡️",
    label: "Radyatör",
    labelEn: "Radiators",
    desc: "E.C.A çelik panel radyatörler. EN 442 sertifikalı, düşük sıcaklık sistemleri için.",
    descEn: "E.C.A steel panel radiators. EN 442 certified, optimized for low-temperature systems.",
    theme: "heating",
    productId: "p-radiator-eca",
  },
];

const CatalogCard = ({ item }: { item: CatalogItem }) => {
  const { lang } = useLanguage();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const RenderComponent = getCategoryRender(item.key);

  const handleClick = () => {
    navigate({ to: "/urunler/$slug", params: { slug: item.productId } });
  };

  return (
    <div
      className="catalog-card"
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      aria-label={lang === "tr" ? item.label : item.labelEn}
      onMouseEnter={() => setTheme(item.theme)}
      onMouseLeave={() => setTheme("default")}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Emoji + Diamond icon with SVG product miniature */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.25rem",
          gap: "0.5rem",
        }}
      >
        <span
          style={{ fontSize: "2.25rem", lineHeight: 1 }}
          aria-hidden="true"
        >
          {item.emoji}
        </span>
        <div className="diamond-icon-wrap">
          <div className="diamond-icon-inner">
            <div style={{ width: "38px", height: "38px" }}>
              <RenderComponent />
            </div>
          </div>
        </div>
      </div>

      {/* Category name */}
      <h3
        style={{
          fontFamily: "var(--font-premium-display)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          color: "var(--navy-primary)",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        {lang === "tr" ? item.label : item.labelEn}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-premium-body)",
          fontSize: "0.8125rem",
          lineHeight: 1.6,
          color: "#64748b",
          textAlign: "center",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {lang === "tr" ? item.desc : item.descEn}
      </p>

      {/* Arrow indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
          color: "#94a3b8",
          fontSize: "0.75rem",
          fontFamily: "var(--font-premium-display)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          transition: "color var(--dur-fast)",
        }}
        className="catalog-card-arrow"
      >
        Keşfet →
      </div>
    </div>
  );
};

const CatalogSection = () => {
  const { lang } = useLanguage();
  return (
    <section
      id="catalog"
      style={{
        background: "#ffffff",
        padding: "5rem 1.5rem",
        borderTop: "1px solid #f1f5f9",
        transition: "background 800ms ease",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        {/* Section heading */}
        <div
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
          data-reveal
        >
          <div
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "0.6875rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--vega-cyan)",
              marginBottom: "0.75rem",
            }}
          >
            {lang === "tr" ? "Ürün Kategorileri" : "Product Catalog"}
          </div>
          <h2
            className="section-headline"
            style={{
              fontFamily: "var(--font-premium-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "var(--navy-primary)",
              margin: 0,
            }}
          >
            {lang === "tr"
              ? "İhtiyacınıza Uygun Sistemi Keşfedin"
              : "Explore the Right System"}
          </h2>
        </div>

        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.25rem",
          }}
          className="catalog-grid"
          data-reveal-children
        >
          {CATALOG_ITEMS.map((item) => (
            <CatalogCard key={item.key} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
