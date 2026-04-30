import { useRef, useState } from "react";
import { Product, CATEGORY_LABEL } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import Mini3DPreview from "@/components/Mini3DPreview";

interface ProductGridProps {
  products: Product[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ProductCard = ({
  p, active, onSelect,
}: { p: Product; active: boolean; onSelect: (id: string) => void }) => {
  const [hovered, setHovered] = useState(false);
  const { add, openCart } = useCart();
  const { t, lang } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  const name = lang === "tr" ? p.name : p.name_en;
  const description = lang === "tr" ? p.description : p.description_en;
  const specs = lang === "tr" ? p.specs : p.specs_en;
  const category = CATEGORY_LABEL[p.category][lang];

  const onAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(p);
    toast.success(`${name} ${t("toast.added")}`, {
      action: { label: t("toast.openCart"), onClick: () => openCart() },
    });
  };

  return (
    <div
      className="group relative h-72 [perspective:1200px]"
      onClick={() => onSelect(p.id)}
      onMouseEnter={() => {
        setHovered(true);
        // Try to play (some browsers require user gesture, autoplay+muted should work)
        videoRef.current?.play().catch(() => { /* noop */ });
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          hovered ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* === FRONT — auto-playing video === */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden glass [backface-visibility:hidden] transition-all duration-300 ${
            active
              ? "border-amber/70"
              : "group-hover:border-cyan/60"
          }`}
          style={
            active
              ? { boxShadow: "0 0 30px oklch(0.78 0.18 65 / 0.45)" }
              : undefined
          }
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            autoPlay muted loop playsInline
            poster={p.image}
          >
            <source src={p.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />

          <div className="relative h-full flex flex-col p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="font-display text-[10px] tracking-[0.3em] uppercase text-foreground/70">
                {p.brand}
              </span>
              <span
                className={`text-[10px] font-display tracking-[0.2em] uppercase px-2 py-0.5 rounded border backdrop-blur-sm ${
                  active ? "border-amber/60 amber-text" : "border-cyan/40 text-cyan"
                }`}
              >
                {category}
              </span>
            </div>
            <h3
              className={`font-display text-base leading-tight mb-1 ${
                active ? "amber-text" : "text-foreground"
              }`}
            >
              {name}
            </h3>
            <p className="text-xs text-foreground/80 line-clamp-2 mb-3">
              {description}
            </p>

            {/* Hover hint */}
            <div className="mt-auto flex items-center justify-between">
              <span className="font-display text-[9px] tracking-[0.3em] uppercase text-cyan/80">
                ▸ {t("card.specs")}
              </span>
              <span className="font-mono text-[9px] text-foreground/40 uppercase tracking-widest">
                hover
              </span>
            </div>
          </div>

          <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-cyan/60" />
          <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-cyan/60" />
          <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-cyan/60" />
          <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-cyan/60" />
        </div>

        {/* === BACK — specs + add to cart === */}
        <div className="absolute inset-0 rounded-xl overflow-hidden glass-strong border-cyan/50 [backface-visibility:hidden] [transform:rotateY(180deg)] p-5 flex flex-col">
          <div className="mb-3">
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cyan">
              {t("card.specsTitle")}
            </div>
            <h4 className="font-display text-sm mt-1 neon-text">{name}</h4>
          </div>

          <ul className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
            {specs.map((s) => (
              <li
                key={s}
                className="text-xs font-mono px-3 py-1.5 rounded bg-secondary/60 border border-cyan/30 text-foreground/85"
              >
                ▸ {s}
              </li>
            ))}
          </ul>

          <Button
            type="button"
            size="sm"
            onClick={onAdd}
            className="mt-3 w-full bg-gradient-to-r from-amber to-amber/80 text-background hover:opacity-90 font-display tracking-[0.2em] uppercase text-[10px] h-9"
            style={{ boxShadow: "0 0 18px oklch(0.78 0.18 65 / 0.5)" }}
          >
            {t("card.add")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ products, selectedId, onSelect }: ProductGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {products.map((p) => (
      <ProductCard key={p.id} p={p} active={p.id === selectedId} onSelect={onSelect} />
    ))}
  </div>
);

export default ProductGrid;
