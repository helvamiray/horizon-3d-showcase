/**
 * Clean technical SVG product illustrations — one per ProductCategory.
 * CSS drop-shadow + float animation applied externally via className.
 */
import type { ProductCategory } from "@/data/products";

type RenderProps = { className?: string; style?: React.CSSProperties };

/* ── 1. KLIMA — wall-mounted split AC unit ─────────────────────────── */
export const KlimaRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 520 200" fill="none" className={className} style={style}>
    {/* ground shadow */}
    <ellipse cx="260" cy="195" rx="230" ry="7" fill="#c8d3e0" opacity="0.45" />
    {/* main body */}
    <rect x="8" y="32" width="504" height="155" rx="18" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    {/* top accent strip */}
    <rect x="8" y="32" width="504" height="34" rx="18" fill="#f1f5f9" />
    <rect x="8" y="52" width="504" height="14" fill="#f1f5f9" />
    {/* brand lettering */}
    <text x="42" y="56" fontSize="15" fontWeight="700" fill="#0a1628" fontFamily="'Plus Jakarta Sans','Inter',sans-serif" letterSpacing="2">DAIKIN VRV-5</text>
    {/* LED strip */}
    <rect x="390" y="40" width="78" height="6" rx="3" fill="#00d4ff" opacity="0.7" />
    {/* power indicator */}
    <circle cx="472" cy="48" r="7" fill="#10b981" />
    <circle cx="472" cy="48" r="4" fill="#6ee7b7" />
    {/* intake grille lines */}
    {[74, 82, 90, 98, 106, 114, 122].map((y) => (
      <line key={y} x1="22" y1={y} x2="498" y2={y} stroke="#e8edf2" strokeWidth="1.2" />
    ))}
    {/* outlet louvre assembly */}
    <rect x="22" y="133" width="476" height="46" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    {[139, 149, 159, 169].map((y) => (
      <rect key={y} x="28" y={y} width="464" height="5" rx="2.5" fill="#dce3ec" />
    ))}
    {/* corner scan marks */}
    <path d="M22 66 L22 58 L30 58" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
    <path d="M498 66 L498 58 L490 58" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
  </svg>
);

/* ── 2. ISI POMPASI — outdoor air-to-water heat pump unit ───────────── */
export const IsiPompasiRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 380 420" fill="none" className={className} style={style}>
    <ellipse cx="190" cy="415" rx="165" ry="7" fill="#c8d3e0" opacity="0.45" />
    {/* cabinet */}
    <rect x="20" y="18" width="340" height="385" rx="16" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    {/* top handle bar */}
    <rect x="60" y="14" width="260" height="16" rx="8" fill="#dce3ec" />
    {/* fan guard — circular grille */}
    <circle cx="190" cy="210" r="130" fill="#f8fafc" stroke="#dce3ec" strokeWidth="1" />
    <circle cx="190" cy="210" r="108" fill="white" stroke="#e2e8f0" strokeWidth="1" />
    <circle cx="190" cy="210" r="88" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="1" />
    <circle cx="190" cy="210" r="68" fill="#e8edf2" stroke="#d0d7e0" strokeWidth="1" />
    <circle cx="190" cy="210" r="30" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* fan blade spokes */}
    {Array.from({ length: 6 }).map((_, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      return (
        <line
          key={i}
          x1={190 + 30 * Math.cos(angle)}
          y1={210 + 30 * Math.sin(angle)}
          x2={190 + 106 * Math.cos(angle)}
          y2={210 + 106 * Math.sin(angle)}
          stroke="#c8d0da"
          strokeWidth="1.5"
        />
      );
    })}
    {/* brand & model strip */}
    <rect x="30" y="28" width="180" height="28" rx="6" fill="#f1f5f9" />
    <text x="44" y="47" fontSize="13" fontWeight="700" fill="#0a1628" fontFamily="'Plus Jakarta Sans','Inter',sans-serif">GRANT AERONA3</text>
    {/* LED row */}
    <circle cx="306" cy="42" r="5" fill="#10b981" />
    <circle cx="318" cy="42" r="5" fill="#10b981" opacity="0.6" />
    <circle cx="330" cy="42" r="5" fill="#10b981" opacity="0.3" />
    {/* side ventilation louvers */}
    {[360, 371, 382, 393].map((y) => (
      <rect key={y} x="28" y={y} width="324" height="4" rx="2" fill="#dce3ec" />
    ))}
    {/* bottom pipe stubs */}
    <rect x="90" y="399" width="30" height="16" rx="4" fill="#c8d0da" />
    <rect x="260" y="399" width="30" height="16" rx="4" fill="#c8d0da" />
    {/* corner accents */}
    <path d="M28 50 L28 30 L48 30" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
    <path d="M352 50 L352 30 L332 30" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
  </svg>
);

/* ── 3. KOMBİ — wall-mounted condensing boiler ──────────────────────── */
export const KombiRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 300 440" fill="none" className={className} style={style}>
    <ellipse cx="150" cy="436" rx="130" ry="6" fill="#c8d3e0" opacity="0.45" />
    {/* cabinet */}
    <rect x="20" y="20" width="260" height="390" rx="16" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    {/* brand stripe */}
    <rect x="20" y="20" width="260" height="38" rx="16" fill="#0a1628" />
    <rect x="20" y="42" width="260" height="16" fill="#0a1628" />
    <text x="44" y="46" fontSize="13" fontWeight="700" fill="white" fontFamily="'Plus Jakarta Sans','Inter',sans-serif" letterSpacing="1">VIESSMANN</text>
    <text x="44" y="57" fontSize="9" fill="rgba(255,255,255,0.6)" fontFamily="monospace" letterSpacing="2">VITODENS 200-W</text>
    {/* LCD display */}
    <rect x="50" y="76" width="200" height="100" rx="8" fill="#1a2d44" />
    <rect x="58" y="84" width="184" height="84" rx="5" fill="#0d1f35" />
    {/* display content */}
    <text x="90" y="116" fontSize="22" fontWeight="700" fill="#00d4ff" fontFamily="monospace">24.5°C</text>
    <text x="80" y="134" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="monospace" letterSpacing="1">HEATING MODE ACTIVE</text>
    <text x="90" y="152" fontSize="11" fill="#10b981" fontFamily="monospace">● COP 5.12</text>
    {/* control knobs */}
    <circle cx="90" cy="218" r="20" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="2" />
    <circle cx="90" cy="218" r="12" fill="#e8edf2" stroke="#c8d0da" strokeWidth="1.5" />
    <line x1="90" y1="207" x2="90" y2="213" stroke="#0a1628" strokeWidth="2" />
    <circle cx="210" cy="218" r="20" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="2" />
    <circle cx="210" cy="218" r="12" fill="#e8edf2" stroke="#c8d0da" strokeWidth="1.5" />
    <line x1="204" y1="212" x2="209" y2="215" stroke="#0a1628" strokeWidth="2" />
    {/* buttons row */}
    {[80, 120, 160, 200, 240].map((x) => (
      <rect key={x} x={x - 10} y="256" width="20" height="12" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1" />
    ))}
    {/* body ventilation slots */}
    {[285, 295, 305].map((y) => (
      <rect key={y} x="40" y={y} width="220" height="5" rx="2.5" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.8" />
    ))}
    {/* bottom pipes */}
    <rect x="65" y="404" width="22" height="26" rx="6" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="105" y="404" width="22" height="26" rx="6" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="150" y="404" width="22" height="26" rx="6" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="190" y="404" width="22" height="26" rx="6" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* corner accents */}
    <path d="M28 68 L28 28 L38 28" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
    <path d="M272 68 L272 28 L262 28" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
  </svg>
);

/* ── 4. TANK — buffer / DHW tank ────────────────────────────────────── */
export const TankRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 260 480" fill="none" className={className} style={style}>
    <ellipse cx="130" cy="476" rx="110" ry="6" fill="#c8d3e0" opacity="0.45" />
    {/* top dome */}
    <ellipse cx="130" cy="76" rx="90" ry="22" fill="#f8fafc" stroke="#dce3ec" strokeWidth="1.5" />
    {/* body */}
    <rect x="40" y="75" width="180" height="330" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    {/* bottom dome */}
    <ellipse cx="130" cy="405" rx="90" ry="22" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="1.5" />
    {/* insulation bands */}
    {[120, 160, 200, 240, 280, 320, 360].map((y) => (
      <rect key={y} x="40" y={y} width="180" height="12" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.8" />
    ))}
    {/* brand label */}
    <rect x="62" y="170" width="136" height="64" rx="8" fill="#f8fafc" stroke="#dce3ec" strokeWidth="1" />
    <text x="75" y="197" fontSize="12" fontWeight="700" fill="#0a1628" fontFamily="'Plus Jakarta Sans','Inter',sans-serif">KODSAN</text>
    <text x="68" y="214" fontSize="9" fill="#64748b" fontFamily="monospace" letterSpacing="1">KAT-500L INOX</text>
    <text x="75" y="228" fontSize="10" fill="#10b981" fontFamily="monospace">● 80mm PU</text>
    {/* top pipe connections */}
    <rect x="112" y="40" width="16" height="38" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="152" y="44" width="14" height="34" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* bottom pipe connections */}
    <rect x="85" y="416" width="16" height="28" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="112" y="416" width="16" height="28" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="150" y="416" width="16" height="28" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* inspection port */}
    <circle cx="130" cy="76" r="12" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    <circle cx="130" cy="76" r="6" fill="#f1f5f9" stroke="#c8d0da" strokeWidth="1" />
  </svg>
);

/* ── 5. RADYATÖR — steel panel radiator ─────────────────────────────── */
export const RadyatorRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 240 460" fill="none" className={className} style={style}>
    <ellipse cx="120" cy="456" rx="105" ry="6" fill="#c8d3e0" opacity="0.45" />
    {/* side brackets (wall mounts) */}
    <rect x="20" y="50" width="18" height="60" rx="5" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="202" y="50" width="18" height="60" rx="5" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="20" y="340" width="18" height="60" rx="5" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="202" y="340" width="18" height="60" rx="5" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* main panel body */}
    <rect x="30" y="60" width="180" height="340" rx="8" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    {/* vertical fin channels */}
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={38 + i * 12} y="70" width="8" height="320" rx="3" fill="#f8fafc" stroke="#e8edf2" strokeWidth="0.8" />
    ))}
    {/* brand tag */}
    <rect x="55" y="185" width="130" height="50" rx="6" fill="white" stroke="#dce3ec" strokeWidth="1" />
    <text x="72" y="208" fontSize="13" fontWeight="700" fill="#0a1628" fontFamily="'Plus Jakarta Sans','Inter',sans-serif">E.C.A</text>
    <text x="62" y="224" fontSize="9" fill="#64748b" fontFamily="monospace" letterSpacing="1">PANEL 600 · EN442</text>
    {/* valve connections */}
    <rect x="56" y="390" width="14" height="22" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <rect x="170" y="390" width="14" height="22" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* thermostatic head */}
    <circle cx="63" cy="412" r="10" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="1.5" />
    <circle cx="63" cy="412" r="5" fill="#dce3ec" />
  </svg>
);

/* ── 6. BORU / POMPA — inline circulation pump ──────────────────────── */
export const BoruRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 400 260" fill="none" className={className} style={style}>
    <ellipse cx="200" cy="255" rx="165" ry="6" fill="#c8d3e0" opacity="0.45" />
    {/* left pipe flange */}
    <rect x="10" y="100" width="60" height="60" rx="6" fill="#e8edf2" stroke="#dce3ec" strokeWidth="1.5" />
    <rect x="0" y="114" width="18" height="32" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <circle cx="40" cy="130" r="20" fill="#f8fafc" stroke="#dce3ec" strokeWidth="1.5" />
    <circle cx="40" cy="130" r="12" fill="#e2e8f0" />
    {/* right pipe flange */}
    <rect x="330" y="100" width="60" height="60" rx="6" fill="#e8edf2" stroke="#dce3ec" strokeWidth="1.5" />
    <rect x="382" y="114" width="18" height="32" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    <circle cx="360" cy="130" r="20" fill="#f8fafc" stroke="#dce3ec" strokeWidth="1.5" />
    <circle cx="360" cy="130" r="12" fill="#e2e8f0" />
    {/* pump volute housing */}
    <circle cx="200" cy="130" r="100" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    <circle cx="200" cy="130" r="84" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <circle cx="200" cy="130" r="68" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="1" />
    {/* impeller */}
    <circle cx="200" cy="130" r="46" fill="white" stroke="#d0d7e0" strokeWidth="1.5" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * 45 * Math.PI) / 180;
      return (
        <path
          key={i}
          d={`M${200 + 14 * Math.cos(a)} ${130 + 14 * Math.sin(a)} Q${200 + 36 * Math.cos(a + 0.3)} ${130 + 36 * Math.sin(a + 0.3)} ${200 + 44 * Math.cos(a + 0.6)} ${130 + 44 * Math.sin(a + 0.6)}`}
          stroke="#c8d0da"
          strokeWidth="2"
          fill="none"
        />
      );
    })}
    {/* central shaft */}
    <circle cx="200" cy="130" r="10" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* motor body */}
    <rect x="160" y="30" width="80" height="70" rx="10" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="1.5" />
    <text x="175" y="59" fontSize="10" fontWeight="700" fill="#0a1628" fontFamily="'Plus Jakarta Sans','Inter',sans-serif">LOWARA</text>
    <text x="170" y="74" fontSize="8" fill="#64748b" fontFamily="monospace" letterSpacing="1">ECOCIRC ErP-A</text>
    {/* LED */}
    <circle cx="230" cy="48" r="5" fill="#10b981" />
    {/* pipe connectors center */}
    <rect x="70" y="114" width="130" height="32" rx="6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
    <rect x="200" y="114" width="130" height="32" rx="6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
  </svg>
);

/* ── 7. YANGIN — fire extinguisher ──────────────────────────────────── */
export const YanginRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 200 480" fill="none" className={className} style={style}>
    <ellipse cx="100" cy="476" rx="75" ry="5" fill="#c8d3e0" opacity="0.45" />
    {/* stand / base */}
    <rect x="55" y="440" width="90" height="28" rx="8" fill="#e8edf2" stroke="#dce3ec" strokeWidth="1.5" />
    <rect x="40" y="458" width="120" height="12" rx="4" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
    {/* body — red cylinder */}
    <rect x="60" y="100" width="80" height="344" rx="12" fill="#e63946" stroke="#cc2f3b" strokeWidth="1.5" />
    {/* highlight stripe */}
    <rect x="66" y="100" width="20" height="344" rx="8" fill="rgba(255,255,255,0.2)" />
    {/* label area */}
    <rect x="65" y="200" width="70" height="120" rx="6" fill="white" opacity="0.95" />
    <text x="74" y="228" fontSize="9" fontWeight="700" fill="#e63946" fontFamily="'Plus Jakarta Sans','Inter',sans-serif">TYCO</text>
    <text x="70" y="242" fontSize="7.5" fill="#0a1628" fontFamily="monospace" letterSpacing="0.5">TS EN 3</text>
    <text x="72" y="256" fontSize="7.5" fill="#0a1628" fontFamily="monospace">6 KG ABC</text>
    <text x="70" y="272" fontSize="7" fill="#64748b" fontFamily="monospace">KURU TOZ</text>
    <text x="70" y="284" fontSize="7" fill="#64748b" fontFamily="monospace">A · B · C SINIFI</text>
    {/* pressure gauge */}
    <circle cx="100" cy="155" r="22" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    <circle cx="100" cy="155" r="17" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    {/* gauge needle */}
    <line x1="100" y1="155" x2="110" y2="145" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    <circle cx="100" cy="155" r="3" fill="#0a1628" />
    <text x="87" y="178" fontSize="7" fill="#64748b" fontFamily="monospace">12 BAR</text>
    {/* neck + valve assembly */}
    <rect x="86" y="72" width="28" height="34" rx="6" fill="#cc2f3b" stroke="#aa2530" strokeWidth="1.5" />
    {/* safety pin */}
    <rect x="114" y="80" width="30" height="5" rx="2.5" fill="#f59e0b" />
    <circle cx="144" cy="82" r="5" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    {/* handle */}
    <path d="M84 60 C78 48 70 40 72 30 C74 20 88 18 96 24" stroke="#cc2f3b" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M116 60 C122 48 130 40 128 30 C126 20 112 18 104 24" stroke="#cc2f3b" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* hose nozzle */}
    <path d="M70 88 Q50 96 38 112 Q30 120 36 128" stroke="#dce3ec" strokeWidth="6" fill="none" strokeLinecap="round" />
    <rect x="24" y="124" width="24" height="12" rx="5" fill="#dce3ec" stroke="#c8d0da" strokeWidth="1.5" />
  </svg>
);

/* ── 8. FANCOIL — ceiling cassette ──────────────────────────────────── */
export const FancoilRender = ({ className, style }: RenderProps) => (
  <svg viewBox="0 0 380 280" fill="none" className={className} style={style}>
    <ellipse cx="190" cy="276" rx="165" ry="5" fill="#c8d3e0" opacity="0.45" />
    {/* ceiling plate */}
    <rect x="10" y="10" width="360" height="240" rx="14" fill="white" stroke="#dce3ec" strokeWidth="1.5" />
    {/* inner ring/frame */}
    <rect x="28" y="28" width="324" height="204" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    {/* central air intake grill */}
    <rect x="130" y="94" width="120" height="72" rx="8" fill="#f1f5f9" stroke="#dce3ec" strokeWidth="1" />
    {Array.from({ length: 5 }).map((_, i) => (
      <rect key={i} x="138" y={100 + i * 13} width="104" height="7" rx="3" fill="#dce3ec" />
    ))}
    {/* 4 corner outlet louvres */}
    {[
      { x: 36, y: 36, w: 80, h: 50 },
      { x: 264, y: 36, w: 80, h: 50 },
      { x: 36, y: 174, w: 80, h: 50 },
      { x: 264, y: 174, w: 80, h: 50 },
    ].map((r, i) => (
      <g key={i}>
        <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="6" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.8" />
        {Array.from({ length: 4 }).map((_, j) => (
          <rect key={j} x={r.x + 6} y={r.y + 6 + j * 10} width={r.w - 12} height="5" rx="2.5" fill="#dce3ec" />
        ))}
      </g>
    ))}
    {/* brand + LED */}
    <text x="150" y="185" fontSize="11" fontWeight="700" fill="#0a1628" fontFamily="'Plus Jakarta Sans','Inter',sans-serif">DAIKIN FWE</text>
    <circle cx="338" cy="40" r="6" fill="#10b981" />
    {/* corner accents */}
    <path d="M26 52 L26 26 L38 26" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
    <path d="M354 52 L354 26 L342 26" stroke="#00d4ff" strokeWidth="1.8" fill="none" />
  </svg>
);

/* ── Dispatch map ───────────────────────────────────────────────────── */
export const CATEGORY_RENDERS: Record<
  string,
  React.FC<{ className?: string; style?: React.CSSProperties }>
> = {
  klima:      KlimaRender,
  "isi-pompasi": IsiPompasiRender,
  kombi:      KombiRender,
  radyator:   RadyatorRender,
  boru:       BoruRender,
  tank:       TankRender,
  yangin:     YanginRender,
  fancoil:    FancoilRender,
};

export function getCategoryRender(category: string) {
  return CATEGORY_RENDERS[category] ?? KlimaRender;
}
