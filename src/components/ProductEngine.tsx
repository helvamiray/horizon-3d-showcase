/**
 * ProductEngine
 * ─────────────────────────────────────────────────────────────────────────
 * Compact product grid with:
 *  • Category filter tabs + live search
 *  • Default card: image or neutral placeholder + product name
 *  • Hover/focus: slides in full description + specs + CTA
 *  • NO PRICE anywhere
 */
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { CATEGORY_LABEL, type Product, type ProductCategory } from "@/data/products";
import { getProducts } from "@/lib/productService";

const BRAND_FILTERS = ["TÜMÜ", "Daikin", "Buderus", "Viessmann", "Caleffi", "Tyco", "Lowara", "Vaillant"];

const SIDEBAR_CATEGORIES: { key: ProductCategory | "all"; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "klima", label: "Klima" },
  { key: "vrf", label: "Fancoil" },
  { key: "isi-pompasi", label: "Isı Pompası" },
  { key: "kombi", label: "Kazan" },
  { key: "yangin", label: "Yangın" },
  { key: "radyator", label: "Radyatör" },
  { key: "boru", label: "Hidrofor" },
];

/* ── Single product card ────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const label = CATEGORY_LABEL[product.category].tr;
  const hasImg = Boolean(product.image && product.image !== "/placeholder.svg");

  const open = () => {
    navigate({ to: "/urunler/$slug", params: { slug: product.id } });
  };

  return (
    <div
      className="product-engine-card"
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      aria-label={product.name}
      style={{
        position: "relative",
        background: hovered
          ? "var(--terminal-surface2, #0d1520)"
          : "var(--terminal-surface, #080d14)",
        borderTop: "2px solid rgba(0,240,255,0.22)",
        borderRight: `1px solid ${hovered ? "rgba(0,240,255,0.28)" : "var(--terminal-border, rgba(0,240,255,0.1))"}`,
        borderBottom: `1px solid ${hovered ? "rgba(0,240,255,0.28)" : "var(--terminal-border, rgba(0,240,255,0.1))"}`,
        borderLeft: `1px solid ${hovered ? "rgba(0,240,255,0.28)" : "var(--terminal-border, rgba(0,240,255,0.1))"}`,
        borderRadius: "6px",
        padding: "1.4rem 1.25rem 1.25rem",
        cursor: "pointer",
        transition: "background 220ms ease, border-color 220ms ease, box-shadow 220ms ease",
        boxShadow: hovered ? "0 0 28px rgba(0,240,255,0.06)" : "none",
        overflow: "hidden",
        minHeight: "160px",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {/* Category badge */}
      <span style={{
        fontFamily: "var(--font-premium-mono)", fontSize: "9px",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--electric-cyan, #00f0ff)", opacity: 0.6,
      }}>
        {label}
      </span>

      {/* Image or neutral placeholder */}
      <div style={{
        height: hovered ? 52 : 64,
        borderRadius: "6px",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "height 220ms ease",
        color: "rgba(0,240,255,0.35)",
      }}>
        {hasImg ? (
          <img
            src={product.image}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Package size={hovered ? 28 : 34} strokeWidth={1.25} aria-hidden />
        )}
      </div>

      {/* Product name — always visible */}
      <h3 style={{
        fontFamily: "var(--font-premium-display)",
        fontSize: "clamp(13px, 1.2vw, 15px)",
        fontWeight: 700,
        color: "#fff",
        letterSpacing: "-0.01em",
        margin: 0,
        lineHeight: 1.3,
      }}>
        {product.name}
      </h3>

      {/* Reveal: description + first 2 specs + CTA — only when hovered */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <p style={{
              fontFamily: "var(--font-premium-body)", fontSize: "12px",
              color: "rgba(255,255,255,0.42)", lineHeight: 1.6, margin: 0,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {product.description}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
              {product.specs.slice(0, 2).map((s, i) => (
                <li key={i} style={{
                  fontFamily: "var(--font-premium-mono)", fontSize: "10px",
                  color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em",
                  display: "flex", alignItems: "center", gap: "5px",
                }}>
                  <span style={{ color: "var(--electric-cyan,#00f0ff)", opacity: 0.5 }}>—</span>
                  {s}
                </li>
              ))}
            </ul>

            <span style={{
              fontFamily: "var(--font-premium-mono)", fontSize: "10px",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--electric-cyan, #00f0ff)", marginTop: "4px",
            }}>
              → Detayları Gör
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarFiltersProps {
  search: string;
  activeBrand: string;
  activeCategory: ProductCategory | "all";
  filterOpen: boolean;
  filteredCount: number;
  onToggle: () => void;
  onSearchChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: ProductCategory | "all") => void;
}

function SidebarFilters({
  search,
  activeBrand,
  activeCategory,
  filterOpen,
  filteredCount,
  onToggle,
  onSearchChange,
  onBrandChange,
  onCategoryChange,
}: SidebarFiltersProps) {
  return (
    <aside className={`filter-panel${filterOpen ? " open" : " collapsed"}`} aria-label="Ürün kataloğu filtreleri">
      <button type="button" className="filter-toggle" onClick={onToggle}>
        {filterOpen ? "◀ Filtreleri Gizle" : "▶ Filtreler"}
      </button>
      {filterOpen && (
        <div className="filter-content">
          <input
            type="search"
            className="catalog-search"
            placeholder="Ürün veya marka ara..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <div className="brand-chip-row" aria-label="Marka filtresi">
            {BRAND_FILTERS.map((brand) => (
              <button
                key={brand}
                type="button"
                className={`brand-chip${activeBrand === brand ? " active" : ""}`}
                onClick={() => onBrandChange(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="category-list" aria-label="Kategori filtresi">
            {SIDEBAR_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`category-item${activeCategory === cat.key ? " active" : ""}`}
                onClick={() => onCategoryChange(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <p className="catalog-results-count">
            {filteredCount} ürün bulundu
          </p>
        </div>
      )}
    </aside>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div
      className="products-grid-area"
      role="region"
      aria-label="Ürün listesi — yatay kaydırın"
    >
      <div className="catalog-product-grid">
        {products.length === 0 && (
          <p className="catalog-empty-results">
            Sonuç bulunamadı
          </p>
        )}
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

/* ── Main section ───────────────────────────────────────────────── */
const ProductEngine = () => {
  const products = getProducts();
  const [search, setSearch] = useState("");
  const [activeBrand, setActiveBrand] = useState("TÜMÜ");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [filterOpen, setFilterOpen] = useState(true);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q);
      const matchBrand = activeBrand === "TÜMÜ" || p.brand === activeBrand;
      const matchCategory = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchBrand && matchCategory;
    });
  }, [activeBrand, activeCategory, products, search]);

  return (
    <section
      id="urunler"
      className="product-catalog-section"
      style={{
        padding: "clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)",
        position: "relative",
      }}
    >
      {/* Top accent line */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg,transparent,var(--electric-cyan,#00f0ff) 50%,transparent)",
        opacity: 0.3,
      }} />

      <div className="catalog-layout">
        <SidebarFilters
          search={search}
          activeBrand={activeBrand}
          activeCategory={activeCategory}
          filterOpen={filterOpen}
          filteredCount={filteredProducts.length}
          onToggle={() => setFilterOpen((v) => !v)}
          onSearchChange={setSearch}
          onBrandChange={setActiveBrand}
          onCategoryChange={setActiveCategory}
        />
        <ProductGrid products={filteredProducts} />
      </div>
    </section>
  );
};

export default ProductEngine;
