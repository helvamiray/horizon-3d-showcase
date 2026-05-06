import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { type Product, type ProductCategory, CATEGORY_LABEL } from "@/data/products";
import { useCart } from "@/providers/CartContext";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { Zap, Thermometer, Wind } from "lucide-react";
import { getVideoForProduct } from "@/constants/productVideos";
import { preloadVideo } from "@/utils/videoPreload";

interface ProductGridProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Per-category accent colour bar mapping
const CAT_COLORS: Record<ProductCategory, string> = {
  "vrf":         "var(--electric-cyan,#00f0ff)",
  "isi-pompasi": "var(--gold)",
  "kombi":       "var(--navy-primary)",
  "klima":       "var(--vega-cyan)",
  "radyator":    "var(--navy-light)",
  "boru":        "#5a8a7a",
  "tank":        "#7a6a5a",
  "yangin":      "var(--cat-fire)",
};

const SPEC_ICONS = [Zap, Thermometer, Wind];

const ProductCard = ({
  p,
  active,
  onSelect,
}: {
  p: Product;
  active: boolean;
  onSelect: (id: string) => void;
}) => {
  const { add, openCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const name     = lang === "tr" ? p.name     : p.name_en;
  const specs    = (lang === "tr" ? p.specs    : p.specs_en).slice(0, 3);
  const category = CATEGORY_LABEL[p.category][lang];
  const isCooling = p.category === "klima";
  const accentColor = CAT_COLORS[p.category] ?? "var(--navy-primary)";

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(p);
    // Open cart after short delay so user sees the badge increment
    setTimeout(openCart, 400);
    toast.success(`${name} ${t("toast.added")}`, {
      action: { label: t("toast.openCart"), onClick: () => openCart() },
    });
  };

  return (
    <article
      className={`pcard${isCooling ? " card-cooling" : ""}`}
      onClick={() => onSelect(p.id)}
      onMouseEnter={() => preloadVideo(getVideoForProduct(p.category))}
      style={active ? { boxShadow: `0 0 0 2px ${accentColor}`, borderColor: accentColor } : undefined}
      aria-current={active ? "true" : undefined}
    >
      {/* Image / video area */}
      <div className="pcard-img-wrap card-img-wrap">
        <video
          ref={videoRef}
          muted
          loop
          autoPlay
          playsInline
          poster={p.image}
          aria-hidden="true"
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 600ms var(--ease-premium)" }}
          onMouseEnter={() => videoRef.current?.play().catch(() => undefined)}
        >
          <source src={p.video} type="video/mp4" />
        </video>
      </div>

      {/* Category colour bar */}
      <div
        className="pcard-cat-bar"
        style={{ background: accentColor }}
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="pcard-body">
        <div className="pcard-brand">{p.brand}</div>
        <h3 className="pcard-name">{name}</h3>

        {specs.length > 0 && (
          <div className="pcard-specs">
            {specs.map((s, i) => {
              const Icon = SPEC_ICONS[i % SPEC_ICONS.length];
              return (
                <span key={s} className="pcard-spec-item">
                  <Icon size={11} aria-hidden="true" />
                  {s}
                </span>
              );
            })}
          </div>
        )}

        <div className="pcard-actions">
          <button
            type="button"
            className="pcard-btn-outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: "/urunler/$slug", params: { slug: p.id } });
            }}
            aria-label={`${name} — ${t("card.specs")}`}
          >
            {t("card.specs")}
          </button>
          <button
            type="button"
            className="pcard-btn-fill"
            onClick={onAdd}
            aria-label={`${name} — ${t("card.add")}`}
          >
            {t("card.add")}
          </button>
        </div>

        {/* Active indicator */}
        {active && (
          <div
            style={{
              marginTop: "0.5rem",
              fontFamily: "var(--font-premium-mono)",
              fontSize: "0.625rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor,
            }}
            aria-live="polite"
          >
            ◉ {category} — 3D'de görüntüleniyor
          </div>
        )}
      </div>
    </article>
  );
};

const ProductGrid = ({ products, selectedId, onSelect }: ProductGridProps) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "1rem",
    }}
  >
    {products.map((p) => (
      <ProductCard
        key={p.id}
        p={p}
        active={p.id === selectedId}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default ProductGrid;
