import { useMemo, useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import ProductGrid from "./ProductGrid";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FEATURED_BRANDS = ["Daikin", "Buderus", "E.C.A", "LOWARA", "KODSAN", "CALEFFI", "FRANKISCHE", "Tyco"];

const ProductExplorer = ({ selectedId, onSelect }: Props) => {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  const filtered = useMemo<Product[]>(() => {
    const q = query.trim().toLocaleLowerCase(lang === "tr" ? "tr" : "en");
    return PRODUCTS.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (!q) return true;
      const name = lang === "tr" ? p.name : p.name_en;
      const desc = lang === "tr" ? p.description : p.description_en;
      const specs = (lang === "tr" ? p.specs : p.specs_en).join(" ");
      const hay = `${name} ${p.brand} ${desc} ${p.category} ${specs}`.toLocaleLowerCase(lang === "tr" ? "tr" : "en");
      return hay.includes(q);
    });
  }, [query, brand, lang]);

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-xl p-3 flex items-center gap-2">
        <Search className="w-4 h-4 text-cyan shrink-0 ml-1" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("explorer.search.placeholder")}
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-foreground/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1 rounded text-foreground/60 hover:text-cyan transition-colors"
            aria-label={t("explorer.search.clear")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="glass rounded-xl p-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setBrand(null)}
          className={`text-[10px] font-display tracking-[0.2em] uppercase px-3 py-1 rounded-full border transition-all ${
            brand === null
              ? "border-cyan bg-cyan/15 text-cyan"
              : "border-border/60 text-foreground/60 hover:border-cyan/60 hover:text-cyan"
          }`}
        >
          {t("explorer.brands.all")}
        </button>
        {FEATURED_BRANDS.map((b) => {
          const activeB = brand === b;
          return (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(activeB ? null : b)}
              className={`text-[10px] font-display tracking-[0.2em] uppercase px-3 py-1 rounded-full border transition-all ${
                activeB
                  ? "border-amber bg-amber/15 amber-text"
                  : "border-border/60 text-foreground/60 hover:border-cyan/60 hover:text-cyan"
              }`}
            >
              {b}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          {filtered.length} / {PRODUCTS.length} {t("explorer.results")}
        </span>
        {(query || brand) && (
          <button
            type="button"
            onClick={() => { setQuery(""); setBrand(null); }}
            className="font-display text-[10px] tracking-[0.25em] uppercase text-cyan hover:amber-text transition-colors"
          >
            {t("explorer.reset")}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <div className="font-display text-cyan text-lg mb-2">⌬</div>
          <p className="text-sm text-foreground/70">{t("explorer.empty")}</p>
        </div>
      ) : (
        <ProductGrid products={filtered} selectedId={selectedId} onSelect={onSelect} />
      )}
    </div>
  );
};

export default ProductExplorer;
