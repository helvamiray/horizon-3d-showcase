/**
 * TurkeyMapSimple
 * ─────────────────────────────────────────────────────────────────────────
 * Map stage: optional embedded background (parent) or inline image.
 * SVG overlay: city nodes, connections, tooltips.
 */
import { useState } from "react";

interface City {
  id: string;
  name: string;
  left: number;
  top: number;
  project: string;
  category: string;
}

const CITIES: City[] = [
  { id: "istanbul", name: "İstanbul", left: 17.9, top: 18, project: "Büyük Çekmece İkmal Merkezi", category: "VRF + Yangın" },
  { id: "ankara", name: "Ankara", left: 44.5, top: 34, project: "Ofis Kompleksi Isıtma", category: "VRF + Isı Pompası" },
  { id: "izmir", name: "İzmir", left: 9.8, top: 60, project: "Sanayi Tesisi Soğutması", category: "Endüstriyel Klima" },
  { id: "bursa", name: "Bursa", left: 21.0, top: 28, project: "Hastane Isıtma & Soğutma", category: "Kazan + VRF" },
  { id: "antalya", name: "Antalya", left: 35.5, top: 83, project: "Otel Kompleksi", category: "Chiller + Yangın" },
  { id: "samsun", name: "Samsun", left: 54.0, top: 13, project: "Lojistik Merkezi", category: "Isı Pompası" },
  { id: "trabzon", name: "Trabzon", left: 68.5, top: 16, project: "Endüstri Bölgesi", category: "Kombi + Kazan" },
  { id: "adana", name: "Adana", left: 54.5, top: 80, project: "Fabrika Soğutması", category: "Endüstriyel VRF" },
];

const EDGES: [string, string][] = [
  ["istanbul", "bursa"],
  ["istanbul", "ankara"],
  ["bursa", "ankara"],
  ["ankara", "samsun"],
  ["ankara", "adana"],
  ["samsun", "trabzon"],
  ["istanbul", "izmir"],
  ["izmir", "antalya"],
  ["antalya", "adana"],
];

const MAP_SRC = "/assets/turkiye-map.webp";
const MAP_FALLBACK = "/img/turkiye-map.webp";

function Tooltip({ city }: { city: City }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(8,13,20,0.97)",
        border: "1px solid rgba(0,240,255,0.22)",
        borderRadius: "6px",
        padding: "10px 14px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        backdropFilter: "blur(8px)",
        zIndex: 10,
      }}
    >
      <p style={{ fontFamily: "var(--font-premium-display)", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>
        {city.name}
      </p>
      <p style={{ fontFamily: "var(--font-premium-mono)", fontSize: "10px", color: "rgba(255,255,255,0.5)", margin: "0 0 4px", letterSpacing: "0.04em" }}>
        {city.project}
      </p>
      <span style={{ fontFamily: "var(--font-premium-mono)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--electric-cyan,#00f0ff)", opacity: 0.7 }}>
        {city.category}
      </span>
    </div>
  );
}

export interface TurkeyMapSimpleProps {
  /** When true, no base image — use parent / section background (`/assets/turkiye-map.webp`). */
  overlayOnly?: boolean;
}

const TurkeyMapSimple = ({ overlayOnly = false }: TurkeyMapSimpleProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toVB = (c: City) => ({ x: c.left * 10, y: c.top * 4.7 });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        border: overlayOnly ? "none" : "1px solid var(--terminal-border,rgba(0,240,255,0.1))",
        background: overlayOnly ? "transparent" : "var(--terminal-surface,#080d14)",
        aspectRatio: "1000 / 470",
      }}
    >
      {!overlayOnly && (
        <img
          src={MAP_SRC}
          alt="Türkiye haritası"
          draggable={false}
          decoding="async"
          loading="lazy"
          fetchPriority="low"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = MAP_FALLBACK;
          }}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            opacity: 0.72,
            userSelect: "none",
            filter: "brightness(0.65) saturate(0.5) hue-rotate(165deg)",
          }}
        />
      )}

      <svg
        viewBox="0 0 1000 470"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        {EDGES.map(([aId, bId]) => {
          const a = CITIES.find((c) => c.id === aId);
          const b = CITIES.find((c) => c.id === bId);
          if (!a || !b) return null;
          const pa = toVB(a);
          const pb = toVB(b);
          const active = activeId === aId || activeId === bId;
          return (
            <line
              key={`${aId}-${bId}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke={active ? "rgba(0,240,255,0.45)" : "rgba(0,240,255,0.12)"}
              strokeWidth={active ? "1.4" : "0.9"}
              strokeDasharray="5 4"
            />
          );
        })}

        {CITIES.map((city) => {
          const { x, y } = toVB(city);
          return (
            <g key={city.id} style={{ pointerEvents: "all" }}>
              <circle cx={x} cy={y} r={14} fill="none" stroke="rgba(0,240,255,0.12)" strokeWidth="1" />
              <circle cx={x} cy={y} r={5} fill="var(--electric-cyan,#00f0ff)" opacity={activeId === city.id ? 1 : 0.75} />
            </g>
          );
        })}
      </svg>

      {CITIES.map((city) => {
        const active = activeId === city.id;
        return (
          <div
            key={city.id}
            onMouseEnter={() => setActiveId(city.id)}
            onMouseLeave={() => setActiveId(null)}
            style={{
              position: "absolute",
              left: `${city.left}%`,
              top: `${city.top}%`,
              transform: "translate(-50%, -50%)",
              zIndex: active ? 8 : 4,
              cursor: "default",
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%" }} />

            <span
              style={{
                position: "absolute",
                bottom: "calc(100% + 4px)",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "var(--font-premium-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                whiteSpace: "nowrap",
                textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                transition: "color 150ms ease",
                pointerEvents: "none",
              }}
            >
              {city.name}
            </span>

            {active && <Tooltip city={city} />}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 6,
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--electric-cyan,#00f0ff)",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-premium-mono)",
            fontSize: "9px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Proje Lokasyonu
        </span>
      </div>
    </div>
  );
};

export default TurkeyMapSimple;
