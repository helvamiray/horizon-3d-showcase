import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Package } from "lucide-react";
import { prefersSmoothHashScroll } from "@/utils/navigateToHashSection";
import { SHOWROOM_HERO_IMAGE_URL } from "@/data/showroomCatalog";
import { SHOWROOM_DEV_SCREEN_SLOTS } from "@/data/showroomDevScreen";
import { BrandBoardInteractive } from "@/components/showroom/BrandBoardInteractive";
import type { Product } from "@/data/products";
import { PRODUCTS } from "@/data/products";
import { getProducts, subscribeVegaProductCatalog } from "@/lib/productService";

const SHOWROOM_HERO_HOTSPOT_LABEL: Record<string, string> = {
  "p-heatpump-daikin": "Isı Pompası",
  "p-boiler-buderus": "Kazan Dairesi",
  "p-fire-tyco": "Yangın Güvenlik",
};

interface Props {
  nextSectionId?: string;
}

/**
 * Showroom kahramanı — Vega showroom Dev Ekran: arka plandaki görsel görünür kalır,
 * üzerinde tıklanabilir hotspot noktaları (mavi scan overlay yok).
 */
export default function InteractiveShowroomHero({ nextSectionId = "hakkimizda" }: Props) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    const sync = () => setProducts(getProducts());
    sync();
    return subscribeVegaProductCatalog(sync);
  }, []);

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const scrollToNext = () => {
    const smooth = prefersSmoothHashScroll();
    const el = document.getElementById(nextSectionId);
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    else window.scrollBy({ top: window.innerHeight, behavior: smooth ? "smooth" : "auto" });
  };

  const openProduct = (slug: string) => {
    navigate({ to: "/urunler/$slug", params: { slug } });
  };

  return (
    <>
      <section
        id="hero"
        className="showroom-hero-fixed"
        style={{
          position: "relative",
          width: "100vw",
          /* height CSS sınıfında: 100vh fallback + 100dvh (iOS dvh desteği) */
          backgroundColor: "var(--terminal-bg, #020608)",
          backgroundImage: `url(${SHOWROOM_HERO_IMAGE_URL})`,
        }}
        aria-label="VEGA showroom"
      >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-black/45"
        style={{ zIndex: 1 }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2]"
        style={{
          height: "min(38vh, 320px)",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 52%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]"
        style={{
          height: "30%",
          background: "linear-gradient(to bottom, transparent, rgba(2,6,8,0.9))",
        }}
      />

      {/* Masaüstü — şeffaf hotspotlar */}
      <div className="pointer-events-none absolute inset-0 z-[40] hidden md:block">
        <div className="relative mx-auto h-full max-w-[1920px]">
          <div className="group/dev pointer-events-auto absolute left-[31%] top-[11%] z-10 h-[66%] w-[61%]">
            <div className="relative h-full w-full origin-center transition-transform duration-300 ease-out motion-safe:group-hover/dev:scale-[1.02] motion-safe:group-focus-within/dev:scale-[1.02]">
              {SHOWROOM_DEV_SCREEN_SLOTS.map((slot, idx) => {
                const product = productById.get(slot.productId);
                const shortLabel =
                  SHOWROOM_HERO_HOTSPOT_LABEL[slot.productId] ?? product?.name ?? "Ürün";
                const isFireHotspot = slot.id === "dev-fire";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    className="showroom-hero-hotspot z-[42] flex items-center justify-center border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                    style={{
                      left: isFireHotspot
                        ? `calc(${slot.spot.left}% + 50px)`
                        : `${slot.spot.left}%`,
                      top: isFireHotspot
                        ? `calc(${slot.spot.top}% + 40px)`
                        : `${slot.spot.top}%`,
                      width: `${slot.spot.w}%`,
                      height: `${slot.spot.h}%`,
                    }}
                    onClick={() => openProduct(slot.productId)}
                    aria-label={product?.name ?? shortLabel}
                  >
                    <span className="relative inline-flex shrink-0 items-center justify-center">
                      <span className="showroom-hero-hotspot-dot" aria-hidden />
                      <span className="showroom-hero-hotspot-label font-sans">{shortLabel}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobil — masaüstüyle aynı full-screen hero, sadeleştirilmiş overlay */}
      <div className="showroom-mobile-hero-content md:hidden">
        <span className="showroom-mobile-eyebrow">VEGA MÜHENDİSLİK</span>
        <h1 className="showroom-mobile-title">
          Akıllı HVAC &amp;<br />Enerji Sistemleri
        </h1>

        <div className="grid grid-cols-3 gap-2">
          {SHOWROOM_DEV_SCREEN_SLOTS.map((slot, idx) => {
            const product = productById.get(slot.productId);
            if (!product) return null;
            const hasImg = Boolean(product.image && product.image !== "/placeholder.svg");
            return (
              <button
                key={slot.id}
                type="button"
                className="flex flex-col overflow-hidden rounded-xl border border-cyan-500/30 bg-black/55 text-left shadow-lg backdrop-blur-md transition-all active:scale-95 hover:border-cyan-400/55"
                onClick={() => openProduct(product.id)}
                aria-label={product.name}
              >
                <div className="relative aspect-square bg-black/40">
                  {hasImg ? (
                    <img
                      src={product.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain p-2"
                      decoding="async"
                      loading={idx === 0 ? "eager" : "lazy"}
                      fetchPriority={idx === 0 ? "high" : "low"}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package
                        className="h-8 w-8 text-cyan-400/35"
                        strokeWidth={1.25}
                        aria-hidden
                      />
                    </div>
                  )}
                </div>
                <span className="px-2 py-1.5 text-[10px] font-semibold leading-snug text-slate-100">
                  {product.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hero-scroll-cta-shell z-[60]">
        <div className="hero-scroll-cta-bounce">
          <button
            type="button"
            className="hero-scroll-cta"
            onClick={scrollToNext}
            aria-label="Aşağı kaydır — sonraki bölüme git"
          >
            <ChevronDown
              className="hero-scroll-cta__icon"
              size={24}
              strokeWidth={1.5}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>

      {/* MARKALAR — düşük z-index; .main-content üzerinden kayar */}
      <div className="markalar-panel pointer-events-auto">
        <BrandBoardInteractive appearance="woodBoard" className="h-full min-h-0 w-full" />
      </div>
    </>
  );
}
