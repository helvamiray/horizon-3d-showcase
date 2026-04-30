export type ProductCategory =
  | "isi-pompasi"
  | "kombi"
  | "klima"
  | "radyator"
  | "boru"
  | "tank"
  | "yangin";

export interface Product {
  id: string;
  name: string;
  name_en: string;
  brand: string;
  category: ProductCategory;
  /** key of the highlightable component inside the 3D villa */
  componentKey: string;
  description: string;
  description_en: string;
  specs: string[];
  specs_en: string[];
  /** Image used as poster + cart thumbnail */
  image: string;
  /** Background video URL for the product card (auto-playing, muted, looped) */
  video: string;
}

// All product cards share one fallback video (only one is bundled in /public/videos).
const FALLBACK_VIDEO = "/videos/isi_pompasi.mp4";
const FALLBACK_POSTER = "/placeholder.svg";

export const PRODUCTS: Product[] = [
  {
    id: "p-heatpump-daikin",
    name: "Altherma 3 Havadan Suya Isı Pompası",
    name_en: "Altherma 3 Air-to-Water Heat Pump",
    brand: "Daikin",
    category: "isi-pompasi",
    componentKey: "heatpump",
    description:
      "Isıtma, soğutma ve sıcak kullanım suyu için yüksek verimli inverter ısı pompası.",
    description_en:
      "High-efficiency inverter heat pump for heating, cooling and domestic hot water.",
    specs: ["COP 5.1'e kadar", "R-32 soğutucu akışkan", "8–16 kW aralığı"],
    specs_en: ["COP up to 5.1", "R-32 refrigerant", "8–16 kW range"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-ac-daikin",
    name: "VRV 5 Multi-Split Klima Sistemi",
    name_en: "VRV 5 Multi-Split AC System",
    brand: "Daikin",
    category: "klima",
    componentKey: "ac-units",
    description: "Tüm bina iklim kontrolü için değişken soğutucu hacimli sistem.",
    description_en: "Variable refrigerant volume system for whole-building climate control.",
    specs: ["Bölgesel soğutma", "Wi-Fi kontrol", "Ultra sessiz"],
    specs_en: ["Zoned cooling", "Wi-Fi control", "Ultra quiet"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-fire-tyco",
    name: "Yangın Söndürme Sprinkler Sistemi",
    name_en: "Fire Suppression Sprinkler System",
    brand: "Tyco",
    category: "yangin",
    componentKey: "fire-system",
    description:
      "NFPA 13 uyumlu otomatik sulu yangın söndürme sistemi — sprinkler kafaları, vana grubu ve alarm paneli dahil.",
    description_en:
      "NFPA 13 compliant automatic water-based fire suppression — sprinkler heads, valve assembly and alarm panel.",
    specs: ["NFPA 13 uyumlu", "Hızlı tepki K=80", "Bağımsız alarm vanası"],
    specs_en: ["NFPA 13 compliant", "Quick response K=80", "Standalone alarm valve"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-boiler-buderus",
    name: "Logamax Plus Yoğuşmalı Kombi",
    name_en: "Logamax Plus Condensing Boiler",
    brand: "Buderus",
    category: "kombi",
    componentKey: "boiler",
    description: "Akıllı modülasyonlu duvar tipi yoğuşmalı doğalgaz kombisi.",
    description_en: "Smart-modulating wall-mounted condensing gas boiler.",
    specs: ["%109'a kadar verim", "24–34 kW", "Modbus uyumlu"],
    specs_en: ["Up to 109% efficiency", "24–34 kW", "Modbus compatible"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-radiator-eca",
    name: "Panel Radyatör Seri 600",
    name_en: "Panel Radiator Series 600",
    brand: "E.C.A",
    category: "radyator",
    componentKey: "radiators",
    description: "Düşük sıcaklık sistemleri için tasarlanmış premium çelik panel radyatörler.",
    description_en: "Premium steel panel radiators designed for low-temperature systems.",
    specs: ["EN 442 sertifikalı", "10 yıl garanti", "Çoklu boyut seçeneği"],
    specs_en: ["EN 442 certified", "10-year warranty", "Multiple size options"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-tank-kodsan",
    name: "Paslanmaz Tampon Tank 500L",
    name_en: "Stainless Buffer Tank 500L",
    brand: "KODSAN",
    category: "tank",
    componentKey: "tank",
    description: "Hibrit ısıtma sistemleri için izoleli tampon ve sıcak kullanım suyu tankı.",
    description_en: "Insulated buffer and DHW tank for hybrid heating systems.",
    specs: ["AISI 316 iç yüzey", "PU köpük 80mm", "Solar serpantin"],
    specs_en: ["AISI 316 inner shell", "80mm PU foam", "Solar coil"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-pipe-frankische",
    name: "PEX-A Yerden Isıtma Boru Sistemi",
    name_en: "PEX-A Underfloor Heating System",
    brand: "FRANKISCHE",
    category: "boru",
    componentKey: "underfloor",
    description: "Yerden ısıtma devreleri için oksijen bariyerli PEX-A boru sistemi.",
    description_en: "Oxygen-barrier PEX-A pipe system for underfloor heating circuits.",
    specs: ["DIN 4726", "Ø16–20 mm", "50 yıl ömür"],
    specs_en: ["DIN 4726", "Ø16–20 mm", "50-year lifespan"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-pump-lowara",
    name: "Ecocirc Akıllı Sirkülasyon Pompası",
    name_en: "Ecocirc Smart Circulation Pump",
    brand: "LOWARA",
    category: "boru",
    componentKey: "pump",
    description:
      "Hidronik sistemler için otomatik adapte özellikli ErP-A sirkülasyon pompası.",
    description_en:
      "ErP-A circulation pump with auto-adapt control for hydronic systems.",
    specs: ["EEI ≤ 0.20", "PWM kontrol", "Döküm gövde"],
    specs_en: ["EEI ≤ 0.20", "PWM control", "Cast-iron body"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
  {
    id: "p-valve-caleffi",
    name: "Hidrolik Denge Kabı + Kollektör",
    name_en: "Hydraulic Separator + Manifold",
    brand: "CALEFFI",
    category: "boru",
    componentKey: "manifold",
    description: "Dengeli dağıtım için debimetreli pirinç kollektör.",
    description_en: "Brass manifold with flowmeters for balanced distribution.",
    specs: ["2–12 çıkışlı", "Hava ve tortu ayırıcı", "İzolasyon kiti"],
    specs_en: ["2–12 outlets", "Air & dirt separator", "Insulation kit"],
    image: FALLBACK_POSTER,
    video: FALLBACK_VIDEO,
  },
];

export const BRANDS = [
  "Daikin", "Ecodense", "E.C.A", "Buderus", "LOWARA", "ETNA", "DUCA",
  "KODSAN", "Tanpera", "CALEFFI", "DUYAR", "Honeywell", "Kayse",
  "FRANKISCHE", "Danfoss", "Wates", "Tyco", "ARMAS",
];

export const CATEGORY_LABEL: Record<ProductCategory, { tr: string; en: string }> = {
  "isi-pompasi": { tr: "Isı Pompası", en: "Heat Pump" },
  "kombi": { tr: "Kombi", en: "Boiler" },
  "klima": { tr: "Klima", en: "AC" },
  "radyator": { tr: "Radyatör", en: "Radiator" },
  "boru": { tr: "Boru / Pompa", en: "Pipe / Pump" },
  "tank": { tr: "Tank", en: "Tank" },
  "yangin": { tr: "Yangın Sistemi", en: "Fire System" },
};
