import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ProjectMarker {
  id: string;
  city: string;
  /** Approx. % position on the simplified Turkey SVG (viewBox 0 0 1000 420). */
  x: number;
  y: number;
  titleTr: string;
  titleEn: string;
  subTr: string;
  subEn: string;
}

const PROJECTS: ProjectMarker[] = [
  {
    id: "ist",
    city: "İstanbul",
    x: 235, y: 95,
    titleTr: "150 Konut Isı Pompası Projesi",
    titleEn: "150-Unit Residential Heat Pump Project",
    subTr: "Daikin Altherma · 1.8 MW termal kapasite",
    subEn: "Daikin Altherma · 1.8 MW thermal capacity",
  },
  {
    id: "ank",
    city: "Ankara",
    x: 500, y: 175,
    titleTr: "Endüstriyel Tesis Mekanik Tesisatı",
    titleEn: "Industrial Plant Mechanical Installation",
    subTr: "Viessmann kazan dairesi + BMS entegrasyonu",
    subEn: "Viessmann boiler room + BMS integration",
  },
  {
    id: "izm",
    city: "İzmir",
    x: 200, y: 230,
    titleTr: "Avm Soğutma & VRF Sistemi",
    titleEn: "Shopping Mall Cooling & VRF System",
    subTr: "Daikin VRV 5 · 28 zon",
    subEn: "Daikin VRV 5 · 28 zones",
  },
  {
    id: "brs",
    city: "Bursa",
    x: 290, y: 145,
    titleTr: "Otomotiv Fabrikası Yangın Sistemi",
    titleEn: "Automotive Factory Fire Suppression",
    subTr: "Tyco sprinkler + alarm vana grubu",
    subEn: "Tyco sprinkler + alarm valve assembly",
  },
  {
    id: "ant",
    city: "Antalya",
    x: 410, y: 320,
    titleTr: "Otel Yangın Sistemi Kurulumu",
    titleEn: "Hotel Fire Suppression Installation",
    subTr: "5 yıldız resort · 1200 sprinkler kafası",
    subEn: "5-star resort · 1,200 sprinkler heads",
  },
  {
    id: "tra",
    city: "Trabzon",
    x: 720, y: 110,
    titleTr: "Liman Tesisi Enerji Etüdü",
    titleEn: "Port Facility Energy Audit",
    subTr: "Hibrit ısı pompası + solar termal",
    subEn: "Hybrid heat pump + solar thermal",
  },
  {
    id: "gzt",
    city: "Gaziantep",
    x: 640, y: 290,
    titleTr: "Gıda Üretim Tesisi Soğutma",
    titleEn: "Food Production Plant Cooling",
    subTr: "Endüstriyel chiller · 2.4 MW",
    subEn: "Industrial chiller · 2.4 MW",
  },
];

const TurkeyProjectsMap = () => {
  const { lang, t } = useLanguage();
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div className="relative rounded-2xl overflow-hidden glass border border-cyan/30 p-4 md:p-6">
      {/* Frame label */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-[10px] tracking-[0.35em] uppercase text-cyan/80">
          ◉ {t("map.frameLabel")}
        </span>
        <span className="font-mono text-[10px] text-foreground/50 uppercase tracking-widest">
          {PROJECTS.length} {t("map.sites")}
        </span>
      </div>

      <div className="relative w-full aspect-[1000/420]">
        <svg
          viewBox="0 0 1000 420"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={t("map.aria")}
        >
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.18 0.04 230)" />
              <stop offset="100%" stopColor="oklch(0.12 0.03 240)" />
            </linearGradient>
            <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.32 0.04 220)" />
              <stop offset="100%" stopColor="oklch(0.22 0.04 230)" />
            </linearGradient>
            <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.78 0.18 65)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="oklch(0.78 0.18 65)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sea background */}
          <rect width="1000" height="420" fill="url(#seaGrad)" />

          {/* Subtle grid */}
          <g opacity="0.12" stroke="oklch(0.78 0.16 210)" strokeWidth="0.5">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={420} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 50} x2={1000} y2={i * 50} />
            ))}
          </g>

          {/* Stylised Turkey landmass — simplified silhouette */}
          <path
            d="M 130 130
               C 160 90, 220 70, 280 80
               C 340 65, 410 75, 470 90
               C 540 80, 620 95, 700 110
               C 760 105, 820 120, 870 145
               C 905 160, 925 195, 905 230
               C 895 260, 860 285, 810 295
               C 760 310, 700 320, 640 320
               C 580 335, 520 340, 460 335
               C 400 345, 340 340, 290 325
               C 240 330, 195 320, 160 295
               C 125 275, 105 240, 110 205
               C 105 175, 115 150, 130 130 Z"
            fill="url(#landGrad)"
            stroke="oklch(0.78 0.16 210 / 0.55)"
            strokeWidth="1.2"
          />

          {/* Inner highlight strokes for "topographic" feel */}
          <path
            d="M 200 180 C 280 160, 380 175, 480 180 C 580 175, 680 195, 780 210"
            fill="none"
            stroke="oklch(0.78 0.16 210 / 0.25)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
          <path
            d="M 240 250 C 340 245, 440 260, 540 255 C 640 260, 740 270, 820 270"
            fill="none"
            stroke="oklch(0.78 0.16 210 / 0.22)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />

          {/* Markers */}
          {PROJECTS.map((p) => {
            const active = hoverId === p.id;
            return (
              <g key={p.id}
                 transform={`translate(${p.x}, ${p.y})`}
                 onMouseEnter={() => setHoverId(p.id)}
                 onMouseLeave={() => setHoverId(null)}
                 className="cursor-pointer"
              >
                {/* Glow halo */}
                <circle r="22" fill="url(#markerGlow)" />
                {/* Pulsing rings */}
                <circle r="6" fill="none" stroke="oklch(0.78 0.18 65)" strokeWidth="1.2" opacity="0.8">
                  <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="6" fill="none" stroke="oklch(0.78 0.18 65)" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" from="6" to="14" dur="2s" begin="0.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.6s" repeatCount="indefinite" />
                </circle>
                {/* Core dot */}
                <circle
                  r={active ? 6 : 5}
                  fill="oklch(0.78 0.18 65)"
                  stroke="oklch(0.96 0.02 90)"
                  strokeWidth="1.2"
                  style={{ transition: "r 0.2s" }}
                />
                {/* City label */}
                <text
                  x={p.x > 800 ? -10 : 10}
                  y={4}
                  textAnchor={p.x > 800 ? "end" : "start"}
                  className="font-display"
                  fontSize="11"
                  fill="oklch(0.96 0.02 90)"
                  opacity={active ? 1 : 0.85}
                  style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}
                >
                  {p.city}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip overlay */}
        {hoverId && (() => {
          const p = PROJECTS.find((x) => x.id === hoverId)!;
          // Convert SVG coords → percent for absolute positioning
          const left = (p.x / 1000) * 100;
          const top = (p.y / 420) * 100;
          // Flip horizontally on right edge
          const flipX = left > 70;
          return (
            <div
              className="pointer-events-none absolute z-10 w-60 animate-fade-in"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(${flipX ? "calc(-100% - 16px)" : "16px"}, -50%)`,
              }}
            >
              <div className="glass border border-amber/50 rounded-lg p-3 backdrop-blur-xl"
                   style={{ boxShadow: "0 0 24px oklch(0.78 0.18 65 / 0.4)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                  <span className="font-display text-[10px] tracking-[0.3em] uppercase amber-text">
                    {p.city}
                  </span>
                </div>
                <h4 className="font-display text-sm leading-tight text-foreground mb-1">
                  {lang === "tr" ? p.titleTr : p.titleEn}
                </h4>
                <p className="text-[11px] text-foreground/70 font-mono">
                  ▸ {lang === "tr" ? p.subTr : p.subEn}
                </p>
              </div>
            </div>
          );
        })()}
      </div>

      <p className="mt-3 text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
        ▸ {t("map.hint")}
      </p>
    </div>
  );
};

export default TurkeyProjectsMap;
