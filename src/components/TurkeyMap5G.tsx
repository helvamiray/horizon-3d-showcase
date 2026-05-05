import { useState } from "react";

interface City {
  id: string;
  label: string;
  x: number;
  y: number;
  projects: number;
  types: string[];
}

interface Connection {
  a: string;
  b: string;
}

const CITIES: City[] = [
  { id: "istanbul",  label: "İstanbul",  x: 142, y: 98,  projects: 48, types: ["Klima", "VRF", "Yangın"]     },
  { id: "ankara",    label: "Ankara",    x: 285, y: 148, projects: 31, types: ["Kazan", "Isı Pompası"]        },
  { id: "izmir",     label: "İzmir",     x: 148, y: 198, projects: 24, types: ["Soğutma", "Fancoil"]          },
  { id: "antalya",   label: "Antalya",   x: 260, y: 270, projects: 19, types: ["Otel HVAC", "Yangın"]         },
  { id: "bursa",     label: "Bursa",     x: 200, y: 118, projects: 15, types: ["Kazan Dairesi"]               },
  { id: "mugla",     label: "Muğla",     x: 195, y: 248, projects: 12, types: ["Villa Isı Pompası"]           },
  { id: "konya",     label: "Konya",     x: 300, y: 205, projects: 9,  types: ["AVM Yangın"]                  },
  { id: "gaziantep", label: "Gaziantep", x: 365, y: 258, projects: 7,  types: ["Endüstriyel Soğutma"]         },
];

const CONNECTIONS: Connection[] = [
  { a: "istanbul",  b: "ankara"   },
  { a: "istanbul",  b: "izmir"    },
  { a: "ankara",    b: "antalya"  },
  { a: "ankara",    b: "konya"    },
  { a: "istanbul",  b: "bursa"    },
  { a: "konya",     b: "gaziantep"},
];

const TurkeyMap5G = () => {
  const [hovered, setHovered] = useState<City | null>(null);

  const cityById = (id: string) => CITIES.find((c) => c.id === id)!;

  return (
    <section className="turkey-map-outer" id="harita" aria-label="Proje Haritası">
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Section heading */}
        <div style={{ marginBottom: "3rem", textAlign: "center" }} data-reveal>
          <span
            style={{
              fontFamily: "var(--font-premium-mono)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--gold)",
              display: "block",
              marginBottom: "12px",
            }}
          >
            Proje Referansları · Türkiye Geneli
          </span>
          <h2
            className="section-headline"
            style={{
              fontFamily: "var(--font-premium-display)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "white",
              margin: 0,
            }}
          >
            Her Şehirde, Her Sistemde
          </h2>
        </div>

        {/* Map container with 3D tilt */}
        <div className="turkey-map-container" data-reveal>
          <div className="turkey-svg-wrapper">
            <div style={{ position: "relative" }}>
              <svg
                viewBox="0 0 550 350"
                className="turkey-svg"
                style={{ width: "100%", height: "auto", display: "block" }}
                aria-label="Türkiye proje konumları haritası"
              >
                <defs>
                  <linearGradient id="sea5g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0a1628" />
                    <stop offset="100%" stopColor="#060e1a" />
                  </linearGradient>
                  <linearGradient id="land5g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a3a5c" />
                    <stop offset="100%" stopColor="#0f2040" />
                  </linearGradient>
                </defs>

                {/* Sea background */}
                <rect width="550" height="350" fill="url(#sea5g)" rx="8" />

                {/* Grid lines */}
                <g opacity="0.08" stroke="#00d4ff" strokeWidth="0.5">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 55} y1={0} x2={i * 55} y2={350} />
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <line key={`h${i}`} x1={0} y1={i * 50} x2={550} y2={i * 50} />
                  ))}
                </g>

                {/* Turkey silhouette */}
                <path
                  d="M 75 130
                     C 95 90, 130 72, 165 80
                     C 200 65, 245 72, 285 85
                     C 330 78, 385 88, 430 102
                     C 470 98, 510 115, 530 138
                     C 545 158, 548 188, 530 215
                     C 515 238, 488 258, 458 268
                     C 420 282, 375 290, 330 292
                     C 285 304, 240 308, 200 302
                     C 162 312, 128 305, 102 286
                     C 78 268, 64 238, 68 205
                     C 62 178, 68 152, 75 130 Z"
                  fill="url(#land5g)"
                  stroke="rgba(0,212,255,0.3)"
                  strokeWidth="1.2"
                />

                {/* Topographic inner lines */}
                <path
                  d="M 130 190 C 200 172, 295 182, 385 188 C 450 185, 510 202, 525 215"
                  fill="none"
                  stroke="rgba(0,212,255,0.15)"
                  strokeWidth="0.8"
                  strokeDasharray="3 5"
                />
                <path
                  d="M 155 240 C 240 232, 340 244, 430 240 C 475 242, 510 250, 525 256"
                  fill="none"
                  stroke="rgba(0,212,255,0.12)"
                  strokeWidth="0.8"
                  strokeDasharray="3 5"
                />

                {/* 5G connection lines */}
                {CONNECTIONS.map(({ a, b }) => {
                  const ca = cityById(a);
                  const cb = cityById(b);
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={ca.x}
                      y1={ca.y}
                      x2={cb.x}
                      y2={cb.y}
                      className="connection-line"
                    />
                  );
                })}

                {/* City markers */}
                {CITIES.map((city) => (
                  <g
                    key={city.id}
                    onMouseEnter={() => setHovered(city)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Pulse rings */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={6}
                      className="marker-pulse-1"
                    />
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={6}
                      className="marker-pulse-2"
                    />
                    {/* Core dot */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={hovered?.id === city.id ? 7 : 5}
                      className="marker-core"
                      style={{ transition: "r 0.2s" }}
                    />
                    {/* City label */}
                    <text
                      x={city.x + (city.x > 450 ? -10 : 10)}
                      y={city.y - 10}
                      textAnchor={city.x > 450 ? "end" : "start"}
                      fontSize="9"
                      fill="rgba(255,255,255,0.75)"
                      style={{
                        fontFamily: "var(--font-premium-mono, monospace)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {city.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Tooltip overlay */}
              {hovered && (() => {
                const left = (hovered.x / 550) * 100;
                const top = (hovered.y / 350) * 100;
                const flipX = left > 65;
                return (
                  <div
                    className="city-tooltip-5g"
                    style={{
                      position: "absolute",
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: `translate(${flipX ? "calc(-100% - 12px)" : "12px"}, -50%)`,
                    }}
                  >
                    <span className="city-name">{hovered.label}</span>
                    <span className="project-count">{hovered.projects}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "var(--font-premium-mono)",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      TAMAMLANAN PROJE
                    </span>
                    <div className="city-types">
                      {hovered.types.map((t) => (
                        <span key={t} className="city-type-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TurkeyMap5G;
