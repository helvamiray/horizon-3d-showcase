import { useNavigate } from "@tanstack/react-router";
import { type Product, type ProductCategory, CATEGORY_LABEL } from "@/data/products";
import { useCart } from "@/providers/CartContext";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { Zap, Thermometer, Wind, Package } from "lucide-react";
import { IconShoppingCart } from "@tabler/icons-react";

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
  cardIndex,
}: {
  p: Product;
  active: boolean;
  onSelect: (id: string) => void;
  /** İlk kart görünür LCP adayı — diğerleri `lazy`. */
  cardIndex: number;
}) => {
  const { add, openCart } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const name     = lang === "tr" ? p.name     : p.name_en;
  const specs    = (lang === "tr" ? p.specs    : p.specs_en).slice(0, 3);
  const category = CATEGORY_LABEL[p.category][lang];
  const isCooling = p.category === "klima";
  const accentColor = CAT_COLORS[p.category] ?? "var(--navy-primary)";
  const hasImg = Boolean(p.image && p.image !== "/placeholder.svg");

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(p);
    setTimeout(openCart, 400);
    toast.success(`${name} ${t("toast.added")}`, {
      action: { label: t("toast.openCart"), onClick: () => openCart() },
    });
  };

  return (
    <article
      className={`pcard${isCooling ? " card-cooling" : ""}`}
      onClick={() => onSelect(p.id)}
      style={active ? { boxShadow: `0 0 0 2px ${accentColor}`, borderColor: accentColor } : undefined}
      aria-current={active ? "true" : undefined}
    >
      <div className="pcard-img-wrap card-img-wrap">
        {hasImg ? (
          <img
            src={p.image}
            alt=""
            decoding="async"
            loading={cardIndex === 0 ? "eager" : "lazy"}
            fetchPriority={cardIndex === 0 ? "high" : "low"}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 600ms var(--ease-premium)" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/25">
            <Package size={36} strokeWidth={1.25} className="text-white/35" aria-hidden />
          </div>
        )}
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
            <IconShoppingCart size={15} stroke={1.75} aria-hidden />
            {t("card.add")}
          </button>
        </div>

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
    {products.map((p, i) => (
      <ProductCard
        key={p.id}
        p={p}
        cardIndex={i}
        active={p.id === selectedId}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default ProductGrid;
