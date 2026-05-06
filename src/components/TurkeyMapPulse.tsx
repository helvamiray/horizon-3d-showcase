import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate, svg } from "animejs";

gsap.registerPlugin(ScrollTrigger);

/**
 * Simplified Turkey outline — 1600 × 748 viewBox
 * Key points traced around Turkey's coast & borders.
 */
const TURKEY_OUTLINE =
  "M 162,42 L 220,20 L 295,12 L 420,8 L 580,5 L 780,18 " +
  "L 960,35 L 1100,65 L 1290,58 L 1400,115 L 1510,195 " +
  "L 1545,300 L 1510,410 L 1455,490 L 1400,545 L 1310,558 " +
  "L 1180,560 L 1090,558 L 1020,565 L 965,630 L 940,695 " +
  "L 890,668 L 820,648 L 720,638 L 635,652 L 575,662 " +
  "L 520,640 L 455,592 L 395,555 L 330,528 L 282,520 " +
  "L 235,546 L 190,505 L 148,462 L 112,415 L 78,358 " +
  "L 65,288 L 80,228 L 108,172 L 145,118 L 128,72 L 162,42 Z";

// ── City data — coordinates calibrated to trk.webp (1600 × 748) ─────────────
// Projection: x = (lon − 25.5) / 19.5 × 1600 | y = (42 − lat) / 6.5 × 748
interface CityData {
  id: string;
  name: string;
  x: number;
  y: number;
  project: string;
  category: string;
  color: string;
}

const CITIES: CityData[] = [
  {
    id: "istanbul",
    name: "İstanbul",
    x: 287,
    y: 115,
    project: "Büyük Çekmece İkmal Merkezi",
    category: "VRF Klima + Yangın",
    color: "#38bdf8",
  },
  {
    id: "bursa",
    name: "Bursa",
    x: 335,
    y: 207,
    project: "Nilüfer Rezidans Kompleksi",
    category: "Isı Pompası + Klima",
    color: "#a78bfa",
  },
  {
    id: "izmir",
    name: "İzmir",
    x: 131,
    y: 414,
    project: "Bornova Ticaret Merkezi",
    category: "Merkezi Klima",
    color: "#38bdf8",
  },
  {
    id: "ankara",
    name: "Ankara",
    x: 607,
    y: 241,
    project: "Çayyolu Rezidans Kompleksi",
    category: "Isı Pompası Sistemi",
    color: "#34d399",
  },
  {
    id: "antalya",
    name: "Antalya",
    x: 426,
    y: 586,
    project: "Lara Resort Hotel",
    category: "Soğutma + Yangın",
    color: "#fbbf24",
  },
  {
    id: "samsun",
    name: "Samsun",
    x: 886,
    y: 80,
    project: "Atakum Plaza Kompleksi",
    category: "Kombi + Kazan",
    color: "#fb923c",
  },
  {
    id: "adana",
    name: "Adana",
    x: 803,
    y: 575,
    project: "Seyhan Sanayi Kompleksi",
    category: "Endüstriyel HVAC",
    color: "#f87171",
  },
  {
    id: "trabzon",
    name: "Trabzon",
    x: 1164,
    y: 115,
    project: "Maçka Konut Projesi",
    category: "Yerden Isıtma",
    color: "#34d399",
  },
];

const CONNECTIONS: [string, string][] = [
  ["istanbul", "ankara"],
  ["istanbul", "samsun"],
  ["ankara",   "izmir"],
  ["ankara",   "antalya"],
  ["ankara",   "adana"],
  ["ankara",   "samsun"],
  ["samsun",   "trabzon"],
];

// ── Component ────────────────────────────────────────────────────────────────
const TurkeyMapPulse = () => {
  const svgRef       = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive]  = useState<CityData | null>(null);
  const [tipPos, setTipPos]  = useState({ x: 0, y: 0 });
  const [onRight, setOnRight] = useState(false);

  const cityById = Object.fromEntries(CITIES.map((c) => [c.id, c]));

  // Animate connecting lines on scroll-enter + Anime.js border glow
  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk || !svgRef.current) return;

    /* ── GSAP: city connecting lines draw in on scroll ── */
    const lines = svgRef.current.querySelectorAll<SVGLineElement>(".conn-line");
    lines.forEach((ln) => {
      const len = Math.hypot(
        ln.x2.baseVal.value - ln.x1.baseVal.value,
        ln.y2.baseVal.value - ln.y1.baseVal.value
      );
      gsap.set(ln, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
    });

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, svgRef);

    /* ── Anime.js: border glow dot travels around Turkey ── */
    const borderPath = document.getElementById("turkey-outline-draw");
    const borderDot  = document.getElementById("turkey-border-dot");

    let dotAnim:  ReturnType<typeof animate> | null = null;
    let drawAnim: ReturnType<typeof animate> | null = null;

    if (borderPath && borderDot) {
      try {
        // Travelling dot via createMotionPath
        dotAnim = animate(borderDot, {
          ...svg.createMotionPath("#turkey-outline-draw"),
          duration: 16000,
          loop: true,
          ease: "linear",
        });

        // Chasing "drawn segment" — a short lit segment travels the path
        const drawable = svg.createDrawable("#turkey-outline-draw");
        drawAnim = animate(drawable, {
          draw: ["0 0.06", "0.94 1"],
          duration: 16000,
          loop: true,
          ease: "linear",
        });
      } catch (_) {
        // If svg.createMotionPath/createDrawable not available, fallback gracefully
      }
    }

    return () => {
      ctx.revert();
      dotAnim?.pause();
      drawAnim?.pause();
    };
  }, []);

  const handleEnter = useCallback(
    (e: React.MouseEvent<SVGGElement>, city: CityData) => {
      setActive(city);
      // Compute tooltip position from the SVG element's screen rect
      const svgEl = e.currentTarget.ownerSVGElement as SVGSVGElement;
      const rect  = svgEl.getBoundingClientRect();
      const scaleX = rect.width  / 1600;
      const scaleY = rect.height / 748;
      const screenX = city.x * scaleX + rect.left;
      const screenY = city.y * scaleY + rect.top;
      // Flip tooltip to the left if near right edge
      setOnRight(screenX > window.innerWidth - 280);
      setTipPos({ x: screenX, y: screenY });
    },
    []
  );

  const handleLeave = useCallback(() => setActive(null), []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        borderRadius: "20px",
        overflow: "visible",
        userSelect: "none",
      }}
    >
      {/* Map image + SVG overlay share the same bounding box */}
      <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
        {/* Base map image */}
        <img
          src="/img/trk.webp"
          alt="Türkiye haritası"
          loading="lazy"
          width={1600}
          height={748}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "20px",
            filter: "brightness(0.82) saturate(1.1)",
          }}
        />

        {/* Interactive SVG layer — same aspect ratio, positioned absolutely on top */}
        <svg
          ref={svgRef}
          viewBox="0 0 1600 748"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
          aria-label="Proje konumları"
          role="img"
        >
          <defs>
            {/* Glow for connecting lines */}
            <filter id="glow-conn" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Glow for city dots */}
            <filter id="glow-dot" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Intense glow for border traveller */}
            <filter id="glow-border" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="10" result="big" />
              <feGaussianBlur stdDeviation="4"  result="small" in="SourceGraphic" />
              <feMerge>
                <feMergeNode in="big" />
                <feMergeNode in="small" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Turkey border outline — Anime.js draws & chases it ── */}
          {/* Static very-dim fill so the silhouette is visible */}
          <path
            d={TURKEY_OUTLINE}
            fill="rgba(0,240,255,0.025)"
            stroke="none"
          />
          {/* Animated drawable border (the "drawing" line) */}
          <path
            id="turkey-outline-draw"
            d={TURKEY_OUTLINE}
            fill="none"
            stroke="rgba(0,240,255,0.55)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            filter="url(#glow-conn)"
            style={{ strokeDasharray: "1 1", strokeDashoffset: "0" }}
          />
          {/* Travelling glow dot */}
          <circle
            id="turkey-border-dot"
            r="7"
            fill="#00f0ff"
            filter="url(#glow-border)"
            style={{ offsetPath: `path('${TURKEY_OUTLINE}')` }}
          />

          {/* Connecting lines */}
          {CONNECTIONS.map(([a, b]) => {
            const ca = cityById[a];
            const cb = cityById[b];
            if (!ca || !cb) return null;
            return (
              <line
                key={`${a}-${b}`}
                className="conn-line"
                x1={ca.x} y1={ca.y}
                x2={cb.x} y2={cb.y}
                stroke="rgba(56,189,248,0.5)"
                strokeWidth="1.8"
                strokeLinecap="round"
                filter="url(#glow-conn)"
              />
            );
          })}

          {/* City hotspots */}
          {CITIES.map((city) => (
            <g
              key={city.id}
              onMouseEnter={(e) => handleEnter(e, city)}
              onMouseLeave={handleLeave}
              style={{ cursor: "pointer" }}
              role="button"
              aria-label={`${city.name}: ${city.project}`}
            >
              {/* Outer pulse */}
              <circle
                cx={city.x} cy={city.y} r={22}
                fill="none"
                stroke={city.color}
                strokeWidth="1.2"
                style={{
                  animation: "map-pulse 2.6s ease-out infinite",
                  transformOrigin: `${city.x}px ${city.y}px`,
                  opacity: 0.4,
                }}
              />
              {/* Mid pulse */}
              <circle
                cx={city.x} cy={city.y} r={14}
                fill="none"
                stroke={city.color}
                strokeWidth="1.8"
                style={{
                  animation: "map-pulse 2.6s ease-out infinite 0.7s",
                  transformOrigin: `${city.x}px ${city.y}px`,
                  opacity: 0.6,
                }}
              />
              {/* Inner dot */}
              <circle
                cx={city.x} cy={city.y} r={6}
                fill={city.color}
                filter="url(#glow-dot)"
              />
              {/* Label */}
              <text
                x={city.x}
                y={city.y + 28}
                textAnchor="middle"
                fontSize="12"
                fill="rgba(255,255,255,0.8)"
                fontFamily="var(--font-premium-mono, monospace)"
                letterSpacing="0.05em"
                pointerEvents="none"
              >
                {city.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Glassmorphic tooltip — fixed, so it escapes overflow:hidden on any ancestor */}
      {active && (
        <div
          style={{
            position: "fixed",
            left: onRight ? tipPos.x - 232 : tipPos.x + 20,
            top: Math.max(tipPos.y - 80, 72),
            zIndex: 4000,
            background: "rgba(5,13,26,0.88)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: `1px solid ${active.color}55`,
            borderRadius: "16px",
            padding: "16px 20px",
            width: "210px",
            boxShadow: `0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px ${active.color}22`,
            pointerEvents: "none",
            transition: "opacity 150ms ease",
          }}
        >
          <div style={{ width: "28px", height: "3px", background: active.color, borderRadius: "2px", marginBottom: "10px" }} />
          <p style={{ margin: "0 0 4px", fontFamily: "var(--font-premium-display)", fontWeight: 800, fontSize: "14px", color: "white", lineHeight: 1.3 }}>
            {active.name}
          </p>
          <p style={{ margin: "0 0 8px", fontFamily: "var(--font-premium-body)", fontSize: "12px", color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>
            {active.project}
          </p>
          <span style={{ fontFamily: "var(--font-premium-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: active.color }}>
            {active.category}
          </span>
        </div>
      )}

      <style>{`
        @keyframes map-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(2.4); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
      `}</style>
    </div>
  );
};

export default TurkeyMapPulse;
