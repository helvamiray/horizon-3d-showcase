export type ProductCategory =
  | "vrf"
  | "isi-pompasi"
  | "kombi"
  | "klima"
  | "radyator"
  | "boru"
  | "tank"
  | "yangin";

/** Pricelist currency when set from Admin; catalog defaults omit both. */
export type ProductCurrency = "TRY" | "USD" | "EUR";

export interface Product {
  id: string;
  name: string;
  name_en: string;
  brand: string;
  category: ProductCategory;
  componentKey: string;
  description: string;
  description_en: string;
  specs: string[];
  specs_en: string[];
  image: string;
  preview3d?: "ac" | "heatpump" | "fire-extinguisher";
  price?: number;
  currency?: ProductCurrency;
}

/* Product imagery — WebP under /public/img/ (no bundled MP4). */
const IMG = {
  daikinVrf:       "/img/daikin-vrf.webp",
  mitsubishiWall:  "/img/mitsubishi-wall.webp",
  chiller:         "/img/chiller-unit.webp",
  heatPump:        "/img/heat-pump.webp",
  wiloP:           "/img/wilo-pump.webp",
  plateEx:         "/img/plate-exchanger.webp",
  fireValve:       "/img/fire-valve.webp",
  smokeEx:         "/img/smoke-exhaust.webp",
  firePump:        "/img/fire-pump.webp",
};

export const PRODUCTS: Product[] = [
  /* ── VRF Sistemleri ─────────────────────────────────────────── */
  {
    id: "p-ac-daikin",
    name: "VRV 5 Çoklu-Split VRF Sistemi",
    name_en: "VRV 5 Multi-Split VRF System",
    brand: "Daikin",
    category: "vrf",
    componentKey: "ac-units",
    description:
      "Tüm bina iklim kontrolü için değişken soğutucu akışkanlı (VRF) sistem. Yüksek verimli, düşük gürültülü ve bölgesel kontrollü.",
    description_en:
      "Variable Refrigerant Flow system for whole-building climate control. High-efficiency, low-noise and zone-controlled.",
    specs: [
      "Bölgesel soğutma ve ısıtma",
      "Wi-Fi + BACnet kontrol",
      "Ultra sessiz: 48 dB(A)",
      "R-32 soğutucu akışkan",
      "8–50 kW kapasite aralığı",
    ],
    specs_en: ["Zoned cooling & heating", "Wi-Fi + BACnet control", "Ultra quiet: 48 dB(A)", "R-32 refrigerant", "8–50 kW capacity range"],
    image: IMG.daikinVrf,
    preview3d: "ac",
  },
  {
    id: "p-vrf-mitsubishi",
    name: "City Multi R2 VRF Sistemi",
    name_en: "City Multi R2 VRF System",
    brand: "Mitsubishi Electric",
    category: "vrf",
    componentKey: "ac-units",
    description:
      "Ticari binalara özel çoklu iç ünite bağlantısı yapabilen yüksek verimli VRF sistemi.",
    description_en:
      "High-efficiency VRF system for commercial buildings with multiple indoor unit connections.",
    specs: [
      "1:8 iç ünite oranı",
      "COP 4.0'a kadar",
      "Uzun hat: 165 m",
      "R-32 / R-410A",
    ],
    specs_en: ["1:8 indoor unit ratio", "COP up to 4.0", "Long pipe: 165m", "R-32 / R-410A"],
    image: IMG.mitsubishiWall,
  },
  /* ── Isı Pompası ─────────────────────────────────────────────── */
  {
    id: "p-heatpump-daikin",
    name: "Altherma 3 R Hava/Su Isı Pompası",
    name_en: "Altherma 3 R Air-to-Water Heat Pump",
    brand: "Daikin",
    category: "isi-pompasi",
    componentKey: "heatpump",
    description:
      "Isıtma, soğutma ve sıcak kullanım suyu için yüksek verimli inverter ısı pompası. A+++ enerji sınıfı.",
    description_en:
      "High-efficiency inverter heat pump for heating, cooling and domestic hot water. A+++ energy class.",
    specs: [
      "COP 5.1'e kadar",
      "R-32 soğutucu akışkan",
      "4–16 kW kapasite aralığı",
      "A+++ enerji sınıfı",
      "EHPA sertifikalı",
    ],
    specs_en: ["COP up to 5.1", "R-32 refrigerant", "4–16 kW range", "A+++ energy class", "EHPA certified"],
    image: IMG.heatPump,
    preview3d: "heatpump",
  },
  {
    id: "p-heatpump-samsung",
    name: "EHS Mono Hava/Su Isı Pompası",
    name_en: "EHS Mono Air-to-Water Heat Pump",
    brand: "Samsung",
    category: "isi-pompasi",
    componentKey: "heatpump",
    description:
      "Tek ünite yapısı ile kolay montaj sunan, yerden ısıtma uyumlu hava/su ısı pompası.",
    description_en:
      "Easy-install monoblock air-to-water heat pump compatible with underfloor heating.",
    specs: [
      "Monoblok yapı",
      "5–16 kW",
      "Yerden ısıtma uyumlu",
      "SmartThings entegrasyonu",
    ],
    specs_en: ["Monobloc design", "5–16 kW", "Underfloor compatible", "SmartThings integration"],
    image: IMG.chiller,
  },
  /* ── Klima ────────────────────────────────────────────────────── */
  {
    id: "p-ac-residential",
    name: "Sensira Plus Inverter Split Klima",
    name_en: "Sensira Plus Inverter Split AC",
    brand: "Daikin",
    category: "klima",
    componentKey: "ac-units",
    description:
      "Konut ve küçük ticari mekânlar için A++ inverter split klima. Wifi kontrol, hava temizleme filtresi.",
    description_en:
      "A++ inverter split AC for residential and small commercial use. WiFi control, air purification filter.",
    specs: [
      "A++ enerji sınıfı",
      "2.0–5.0 kW",
      "Wi-Fi (Daikin Online)",
      "Streamer hava temizleme",
    ],
    specs_en: ["A++ energy class", "2.0–5.0 kW", "Wi-Fi (Daikin Online)", "Streamer air purification"],
    image: IMG.mitsubishiWall,
    preview3d: "ac",
  },
  /* ── Kombi / Kazan ───────────────────────────────────────────── */
  {
    id: "p-boiler-buderus",
    name: "Vitodens 200-W Yoğuşmalı Kombi",
    name_en: "Vitodens 200-W Condensing Boiler",
    brand: "Viessmann",
    category: "kombi",
    componentKey: "boiler",
    description:
      "Akıllı modülasyonlu duvar tipi yoğuşmalı doğalgaz kombisi. Modbus ve OpenTherm uyumlu.",
    description_en:
      "Smart-modulating wall-mounted condensing gas boiler. Modbus and OpenTherm compatible.",
    specs: [
      "%109'a kadar verim",
      "24–34 kW",
      "Modbus + OpenTherm",
      "ErP 2021 uyumlu",
    ],
    specs_en: ["Up to 109% efficiency", "24–34 kW", "Modbus + OpenTherm", "ErP 2021 compliant"],
    image: IMG.plateEx,
  },
  {
    id: "p-boiler-industrial",
    name: "Logano Plus GB225 Endüstriyel Kazan",
    name_en: "Logano Plus GB225 Industrial Boiler",
    brand: "Buderus",
    category: "kombi",
    componentKey: "boiler",
    description:
      "Büyük ölçekli sanayi ve hastane projelerine uygun yüksek kapasiteli yoğuşmalı kazan.",
    description_en:
      "High-capacity condensing boiler for large-scale industrial and hospital projects.",
    specs: [
      "100–400 kW",
      "Cascade bağlantı imkânı",
      "BMS entegrasyonu",
      "%108 verim",
    ],
    specs_en: ["100–400 kW", "Cascade connection", "BMS integration", "108% efficiency"],
    image: IMG.chiller,
  },
  /* ── Yangın Sistemleri ───────────────────────────────────────── */
  {
    id: "p-fire-tyco",
    name: "FM-200 Gazlı Yangın Söndürme Sistemi",
    name_en: "FM-200 Gas Fire Suppression System",
    brand: "Honeywell",
    category: "yangin",
    componentKey: "fire-system",
    description:
      "Veri merkezi ve sunucu odaları için TS EN 15004 sertifikalı FM-200 (HFC-227ea) gazlı yangın söndürme sistemi.",
    description_en:
      "TS EN 15004 certified FM-200 (HFC-227ea) fire suppression for data centres and server rooms.",
    specs: [
      "TS EN 15004 sertifikalı",
      "10 sn boşalma süresi",
      "Elektronik + pnömatik tetik",
      "UL/FM onaylı",
    ],
    specs_en: ["TS EN 15004 certified", "10s discharge time", "Electronic + pneumatic trigger", "UL/FM approved"],
    image: IMG.fireValve,
    preview3d: "fire-extinguisher",
  },
  {
    id: "p-fire-detection",
    name: "Akıllı Adresli Yangın Alarm Paneli",
    name_en: "Smart Addressable Fire Alarm Panel",
    brand: "Esser by Honeywell",
    category: "yangin",
    componentKey: "fire-system",
    description:
      "EN 54-2/4 sertifikalı, BACnet/IP destekli adresli yangın ihbar santrali.",
    description_en:
      "EN 54-2/4 certified addressable fire alarm panel with BACnet/IP support.",
    specs: [
      "EN 54-2 / EN 54-4 sertifikalı",
      "2×127 adres kapasitesi",
      "BACnet/IP + Modbus",
      "Grafiksel yazılım desteği",
    ],
    specs_en: ["EN 54-2/4 certified", "2×127 address capacity", "BACnet/IP + Modbus", "Graphical software"],
    image: IMG.smokeEx,
  },
  /* ── Tank / Radyatör / Boru ──────────────────────────────────── */
  {
    id: "p-tank-kodsan",
    name: "Paslanmaz Tampon Tank 500L",
    name_en: "Stainless Buffer Tank 500L",
    brand: "KODSAN",
    category: "tank",
    componentKey: "tank",
    description:
      "Hibrit ısıtma sistemleri için izoleli tampon ve sıcak kullanım suyu tankı. AISI 316 iç yüzey.",
    description_en: "Insulated buffer and DHW tank for hybrid heating systems. AISI 316 inner shell.",
    specs: ["AISI 316 iç yüzey", "PU köpük 80mm", "Solar serpantin", "100–2000 L seçenek"],
    specs_en: ["AISI 316 inner", "80mm PU foam", "Solar coil", "100–2000 L options"],
    image: IMG.firePump,
  },
  {
    id: "p-pump-wilo",
    name: "Stratos MAXO Akıllı Sirkülasyon Pompası",
    name_en: "Stratos MAXO Smart Circulation Pump",
    brand: "Wilo",
    category: "boru",
    componentKey: "pump",
    description:
      "Wilo-Net bağlantılı, enerji tasarruflu ErP-A sınıfı sirkülasyon pompası.",
    description_en:
      "Wilo-Net connected, energy-saving ErP-A class circulation pump.",
    specs: ["EEI ≤ 0.20", "Wilo-Net / Modbus", "Otomatik adapt", "Döküm gövde"],
    specs_en: ["EEI ≤ 0.20", "Wilo-Net / Modbus", "Auto-adapt", "Cast-iron body"],
    image: IMG.wiloP,
  },
];

export const BRANDS = [
  "Daikin",
  "Mitsubishi Electric",
  "Viessmann",
  "Samsung",
  "Wilo",
  "Grundfos",
  "Danfoss",
  "Buderus",
  "Honeywell",
  "E.C.A",
  "CALEFFI",
  "FRANKISCHE",
];

export const CATEGORY_LABEL: Record<ProductCategory, { tr: string; en: string }> = {
  "vrf":        { tr: "VRF Sistemleri", en: "VRF Systems"   },
  "isi-pompasi":{ tr: "Isı Pompası",    en: "Heat Pump"      },
  "kombi":      { tr: "Kazan / Kombi",  en: "Boiler"         },
  "klima":      { tr: "Klima",          en: "AC"             },
  "radyator":   { tr: "Radyatör",       en: "Radiator"       },
  "boru":       { tr: "Boru / Pompa",   en: "Pipe / Pump"    },
  "tank":       { tr: "Tank",           en: "Tank"           },
  "yangin":     { tr: "Yangın Sistemi", en: "Fire System"    },
};
