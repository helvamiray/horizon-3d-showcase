import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { SHOWROOM_BRAND_NODES, SHOWROOM_BRAND_SELECT_EVENT } from "@/data/showroomCatalog";
import { useShowroomFilterOptional } from "@/context/ShowroomFilterContext";
import { navigateToHashSection, prefersSmoothHashScroll } from "@/utils/navigateToHashSection";

export type ShowroomBrandNode = (typeof SHOWROOM_BRAND_NODES)[number];

const floatingChrome =
  "rounded-2xl border border-white/20 bg-black/40 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(148, 163, 184, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function logoMotionVariants(reduceMotion: boolean | null) {
  if (reduceMotion) {
    return {
      rest: { opacity: 1, scale: 1, filter: "none" },
      hover: { opacity: 1, scale: 1, filter: "none" },
      active: { opacity: 1, scale: 1, filter: "none" },
    };
  }
  return {
    rest: {
      opacity: 0.7,
      scale: 1,
      filter: "saturate(0.78) brightness(0.94)",
    },
    hover: {
      opacity: 1,
      scale: 1,
      filter: "saturate(1.14) brightness(1.06)",
    },
    active: {
      opacity: 1,
      scale: 1,
      filter: "saturate(1.08) brightness(1.03)",
    },
  };
}

function glowMotionVariants(reduceMotion: boolean | null) {
  if (reduceMotion) {
    return {
      rest: { opacity: 0, scale: 0.92 },
      hover: { opacity: 0, scale: 0.92 },
      active: { opacity: 0, scale: 0.92 },
    };
  }
  return {
    rest: { opacity: 0, scale: 0.92 },
    hover: { opacity: 1, scale: 1 },
    active: { opacity: 0, scale: 0.92 },
  };
}

/** 8 marka → 3 sütun / 3 satır düzeni; dar panelde dengeli boşluk */
function brandGridColsClass(visibleCount: number): string {
  if (visibleCount <= 0) return "grid-cols-2";
  if (visibleCount <= 2) return "grid-cols-2";
  if (visibleCount <= 12) return "grid-cols-3";
  return "grid-cols-4";
}

export interface BrandBoardInteractiveProps {
  className?: string;
  brands?: readonly ShowroomBrandNode[];
  /** Cam panel (üst overlay); tahta için `woodBoard` kullanın. */
  appearance: "floatingGlass" | "woodBoard";
  /**
   * Önce çağrılır; tam düğüm ile entegrasyon (mevcut davranış).
   */
  onBrandSelect?: (brand: ShowroomBrandNode) => void;
  /**
   * Marka seçildiğinde — ürün filtresi ile birlikte isteğe bağlı global geri çağırım (`brand.label`).
   */
  onBrandSelectName?: (brandName: string) => void;
  selectedKey?: string | null;
}

/**
 * MARKALAR etkileşimi — cam panel veya ahşap tahta hotspot görünümü.
 */
export function BrandBoardInteractive({
  className,
  brands = SHOWROOM_BRAND_NODES,
  appearance,
  onBrandSelect,
  onBrandSelectName,
  selectedKey: selectedKeyProp,
}: BrandBoardInteractiveProps) {
  const navigate = useNavigate();
  const filter = useShowroomFilterOptional();
  const selectedKey = selectedKeyProp ?? filter?.brandKey ?? null;
  const thermalFilter = filter?.thermalFilter ?? null;
  const reduceMotion = useReducedMotion();

  const scrollToCatalog = () => {
    navigateToHashSection(navigate, "urunler");
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById("urunler");
          if (el) {
            el.scrollIntoView({
              behavior: prefersSmoothHashScroll() ? "smooth" : "auto",
              block: "start",
            });
          }
        });
      });
    });
  };

  const handleBrand = (brand: ShowroomBrandNode) => {
    onBrandSelectName?.(brand.label);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(SHOWROOM_BRAND_SELECT_EVENT, { detail: brand.label }),
      );
    }
    onBrandSelect?.(brand);
    if (!onBrandSelect) {
      /** Termal filtre + marka birlikte listeyi boşaltmasın — önce “sadece bu marka” */
      filter?.setThermalFilter(null);
      filter?.toggleBrandKey(brand.key);
    }
    scrollToCatalog();
  };

  const handleThermalHeating = () => {
    filter?.toggleThermalFilter("heating");
    scrollToCatalog();
  };

  const handleThermalCooling = () => {
    filter?.toggleThermalFilter("cooling");
    scrollToCatalog();
  };

  const isWood = appearance === "woodBoard";

  const logoVariants = logoMotionVariants(reduceMotion);
  const glowVariants = glowMotionVariants(reduceMotion);

  return (
    <section
      className={clsx("outline-none", isWood ? "pointer-events-auto bg-transparent" : "pointer-events-auto", className)}
      aria-label="Marka seçimi"
    >
      <div className={clsx(!isWood && floatingChrome)}>
        <p
          className={clsx(
            "markalar-title px-6 pt-5 text-center font-semibold uppercase tracking-[0.35em]",
            isWood ? "text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" : "text-white/90",
          )}
          style={{ fontFamily: "var(--font-premium-mono, ui-monospace, monospace)" }}
        >
          MARKALAR
        </p>

        <div
          className={clsx(
            "brand-board-grid-outer flex w-full justify-center",
            isWood ? "px-4 pb-2 pt-4" : "px-6 pb-2 pt-3",
          )}
        >
          <div
            className={clsx(
              "brand-grid grid w-fit justify-items-center",
              brandGridColsClass(brands.length),
            )}
          >
            {brands.map((brand) => {
              const active = selectedKey === brand.key;
              const logoSrc = brand.logo.trim();
              const accent = brand.accentColor;
              return (
                <div key={brand.key} className="flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => handleBrand(brand)}
                    aria-label={brand.label}
                    aria-pressed={active}
                    initial={false}
                    animate={active ? "active" : "rest"}
                    whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    variants={{ rest: {}, hover: {}, active: {} }}
                    className={clsx(
                      "brand-circle group/logo cursor-pointer rounded-full border-0 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/55",
                      active &&
                        "ring-2 ring-amber-400/90 shadow-[0_0_16px_rgba(251,191,36,0.45)] motion-safe:rounded-full",
                    )}
                  >
                    <motion.span
                      aria-hidden
                      className="brand-circle__glow"
                      variants={glowVariants}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${hexToRgba(accent, 0.48)} 0%, ${hexToRgba(accent, 0.08)} 52%, transparent 72%)`,
                        boxShadow: `0 0 32px 14px ${hexToRgba(accent, 0.42)}, 0 0 56px 28px ${hexToRgba(accent, 0.22)}`,
                      }}
                    />
                    <span className="brand-circle__surface box-border rounded-full bg-white p-2 md:p-2.5">
                      {logoSrc ? (
                        <motion.img
                          src={logoSrc}
                          alt=""
                          draggable={false}
                          className="max-h-full max-w-full object-contain"
                          variants={logoVariants}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="brand-name-text">${brand.label.replace(/</g, "")}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <motion.span
                          className="brand-name-text"
                          variants={logoVariants}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {brand.label}
                        </motion.span>
                      )}
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={clsx(
            "flex flex-wrap items-center justify-center gap-3 pb-1 pt-2",
            isWood ? "mx-4 mb-5" : "mx-6 mb-6",
          )}
        >
          <button
            type="button"
            aria-pressed={thermalFilter === "heating"}
            className={clsx(
              "isitma-sogutma-btn markalar-thermal-btn w-[min(100%,11rem)] shrink-0 rounded-lg px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45",
              thermalFilter === "heating" && "is-active-heating",
              isWood
                ? "border border-white/18 bg-black/25 text-white/88 hover:border-amber-400/35 hover:bg-black/40 hover:shadow-[0_0_14px_rgba(251,191,36,0.22)]"
                : "border border-white/25 bg-black/35 text-white/90 hover:border-white/45 hover:bg-black/50",
            )}
            onClick={handleThermalHeating}
          >
            ISITMA
          </button>
          <button
            type="button"
            aria-pressed={thermalFilter === "cooling"}
            className={clsx(
              "isitma-sogutma-btn markalar-thermal-btn w-[min(100%,11rem)] shrink-0 rounded-lg px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45",
              thermalFilter === "cooling" && "is-active-cooling",
              isWood
                ? "border border-white/18 bg-black/25 text-white/88 hover:border-cyan-400/45 hover:bg-black/40 hover:shadow-[0_0_14px_rgba(34,211,238,0.28)]"
                : "border border-white/25 bg-black/35 text-white/90 hover:border-white/45 hover:bg-black/50",
            )}
            onClick={handleThermalCooling}
          >
            SOĞUTMA
          </button>
        </div>
      </div>
    </section>
  );
}
