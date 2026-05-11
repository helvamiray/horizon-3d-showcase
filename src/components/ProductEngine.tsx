/**
 * ProductEngine
 * ─────────────────────────────────────────────────────────────────────────
 * Numbered category rail + searchable product grid:
 *  • Search row: ürün & marka canlı arama
 *  • Sol: numaralı kategori listesi
 *  • Sağ: vitrin kartları — kategori değişiminde stagger giriş / çıkış kayması
 */
import { useMemo, useState, useEffect, useId, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import {
  PRODUCTS,
  CATEGORY_LABEL,
  type Product,
  type ProductCategory,
} from "@/data/products";
import { SHOWROOM_BRAND_NODES } from "@/data/showroomCatalog";
import { useLanguage } from "@/i18n/LanguageContext";
import { getProducts, subscribeVegaProductCatalog } from "@/lib/productService";
import { useShowroomFilterOptional } from "@/context/ShowroomFilterContext";
import { showroomBrandMatchesProductBrand } from "@/data/showroomCatalog";
import { productMatchesShowroomThermal } from "@/lib/showroomThermalFilter";

const NUMBERED_CATEGORIES: {
  num: string;
  labelTr: string;
  labelEn: string;
  category: ProductCategory;
}[] = [
  { num: "01", labelTr: "Klima", labelEn: "AC", category: "klima" },
  { num: "02", labelTr: "Fancoil", labelEn: "Fancoil", category: "vrf" },
  { num: "03", labelTr: "Kazan", labelEn: "Boiler", category: "kombi" },
  {
    num: "04",
    labelTr: "Boyler ve Genleşme Tankı",
    labelEn: "Buffer & expansion tank",
    category: "tank",
  },
  {
    num: "05",
    labelTr: "Pompa ve Hidrofor",
    labelEn: "Pump & hydrophore",
    category: "boru",
  },
];

function NumberedCategorySidebar({
  activeCategory,
  onSelectCategory,
  onShowAll,
}: {
  activeCategory: ProductCategory | "all";
  onSelectCategory: (c: ProductCategory) => void;
  onShowAll: () => void;
}) {
  const { lang } = useLanguage();
  const listId = useId();

  const rowIsSelected = (cat: ProductCategory) => activeCategory === cat;

  return (
    <aside
      className="category-sidebar lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
      aria-labelledby={`${listId}-heading`}
    >
      <p id={`${listId}-heading`} className="sr-only">
        {lang === "en" ? "Product categories" : "Ürün kategorileri"}
      </p>
      <ul className="category-list" role="list">
        {NUMBERED_CATEGORIES.map((row, index) => {
          const isActive = rowIsSelected(row.category);
          const label = lang === "en" ? row.labelEn : row.labelTr;

          return (
            <li key={row.category}>
              <button
                type="button"
                onClick={() => onSelectCategory(row.category)}
                className={clsx("category-item", isActive && "active")}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="category-number">{row.num}</span>
                <span className="category-name">{label}</span>
              </button>
              {index < NUMBERED_CATEGORIES.length - 1 ? (
                <div className="category-divider" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ul>

      <button type="button" onClick={onShowAll} className="all-products-link">
        <span>{lang === "en" ? "All products" : "Tüm Ürünler"}</span>
        <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
      </button>
    </aside>
  );
}

function ShowcaseProductCard({
  product,
  lang,
  index,
}: {
  product: Product;
  lang: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const hasImg = Boolean(product.image && product.image !== "/placeholder.svg");
  const detailsLabel = lang === "en" ? "Details" : "Detay";
  const categoryLabel =
    lang === "en"
      ? CATEGORY_LABEL[product.category].en
      : CATEGORY_LABEL[product.category].tr;

  return (
    <motion.article
      className="product-card group relative"
      style={{ willChange: reduceMotion ? undefined : "transform" }}
    >
      <Link
        to="/urunler/$slug"
        params={{ slug: product.id }}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,191,0,0.45)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--products-bg)]"
      >
        {hasImg ? (
          <img
            src={product.image}
            alt=""
            className="product-card-image"
            draggable={false}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
          />
        ) : (
          <div className="product-card-image-placeholder" aria-hidden>
            —
          </div>
        )}

        <div className="product-card-body">
          <span className="product-card-category">{categoryLabel}</span>
          <h3 className="product-card-name">
            {lang === "en" ? product.name_en || product.name : product.name}
          </h3>
          <p className="product-card-brand">{product.brand}</p>
          <div className="product-card-footer">
            <span className="product-card-detail">
              {detailsLabel}
              <ArrowRight className="size-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function AnimatedProductGrid({
  products,
  transitionKey,
  filterBlockedHint,
  lang,
}: {
  products: Product[];
  transitionKey: string;
  filterBlockedHint: boolean;
  lang: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="products-grid-area min-h-[280px] flex-1"
      role="region"
      aria-label="Ürün kartları"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          role="list"
          className="catalog-product-grid"
          initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 52 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0, x: 0 } : { opacity: 0, x: -40 }}
          transition={{
            duration: reduceMotion ? 0 : 0.34,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {products.length === 0 ? (
            <p className="catalog-empty-results">
              {filterBlockedHint
                ? lang === "en"
                  ? "No products match the active showroom filters or search. Use «All products» on the left to clear heating/cooling filter and category scope."
                  : "Seçili showroom filtresi veya aramaya uygun ürün yok. Soldaki «Tüm Ürünler» ile ISITMA/SOĞUTMA ve marka odaklı filtreyi sıfırlayabilirsiniz."
                : "Sonuç bulunamadı"}
            </p>
          ) : (
            products.map((p, i) => (
              <motion.div
                key={p.id}
                role="listitem"
                initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.38,
                  delay: reduceMotion ? 0 : 0.06 + i * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ShowcaseProductCard product={p} lang={lang} index={i} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const ProductEngine = () => {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const showroomFilter = useShowroomFilterOptional();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setProducts(getProducts());
    sync();
    return subscribeVegaProductCatalog(sync);
  }, []);

  useEffect(() => {
    const cat = showroomFilter?.pendingCatalogCategory;
    if (!cat || !showroomFilter) return;
    setActiveCategory(cat);
    showroomFilter.setPendingCatalogCategory(null);
  }, [showroomFilter, showroomFilter?.pendingCatalogCategory]);

  /** MARKALAR ISITMA/SOĞUTMA — dar sol kategori seçimi ile termal filtreyi çakıştırma */
  useEffect(() => {
    const thermal = showroomFilter?.thermalFilter ?? null;
    if (thermal === "heating" || thermal === "cooling") {
      setActiveCategory("all");
    }
  }, [showroomFilter?.thermalFilter]);

  /** MARKALAR marka seçimi — sol kategori daraltmasın (yalnızca o markanın ürünleri görünsün) */
  useEffect(() => {
    const bk = showroomFilter?.brandKey;
    if (bk) setActiveCategory("all");
  }, [showroomFilter?.brandKey]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const showroomBrandKey = showroomFilter?.brandKey ?? null;

    return products.filter((p) => {
      const matchSearch =
        q === "" || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);

      const matchBrand = showroomBrandKey
        ? showroomBrandMatchesProductBrand(showroomBrandKey, p.brand)
        : true;

      const matchCategory = activeCategory === "all" || p.category === activeCategory;

      const thermal = showroomFilter?.thermalFilter ?? null;
      const matchThermal = productMatchesShowroomThermal(p, thermal);

      return matchSearch && matchBrand && matchCategory && matchThermal;
    });
  }, [activeCategory, products, search, showroomFilter?.brandKey, showroomFilter?.thermalFilter]);

  const gridTransitionKey = `${activeCategory}|${search.trim()}|${showroomFilter?.brandKey ?? ""}|${showroomFilter?.thermalFilter ?? ""}|${filteredProducts.map((p) => p.id).join("·")}`;

  const brandFilterLabel = useMemo(() => {
    const key = showroomFilter?.brandKey;
    if (!key) return null;
    const node = SHOWROOM_BRAND_NODES.find((n) => n.key === key);
    return node?.label ?? key;
  }, [showroomFilter?.brandKey]);

  const searchAria =
    lang === "en" ? "Search products or brand" : "Ürün veya marka ara";

  return (
    <section
      id="urunler"
      className="product-catalog-section"
      style={{
        padding: "clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg,transparent,var(--electric-cyan,#00f0ff) 50%,transparent)",
          opacity: 0.3,
        }}
      />

      <div className="flex w-full items-center justify-center pb-2 pt-4">
        <div className="search-wrapper">
          <button
            type="button"
            className="search-icon-btn"
            aria-label={searchAria}
            onClick={() => searchInputRef.current?.focus()}
          >
            <Search className="size-5 shrink-0" strokeWidth={2} aria-hidden />
          </button>
          <input
            ref={searchInputRef}
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "en" ? "Search products or brand..." : "Ürün veya marka ara..."}
            aria-label={searchAria}
            autoComplete="off"
          />
        </div>
      </div>

      {showroomFilter?.thermalFilter === "heating" ? (
        <p className="catalog-thermal-hint mx-auto mb-4 max-w-3xl px-4 text-center text-sm">
          <strong className="catalog-thermal-hint__heat">
            {lang === "en" ? "Heating" : "Isıtma"}
          </strong>
          {lang === "en"
            ? " — showing heat pumps, boilers, pumps, tanks, radiators & fire systems."
            : " — ısı pompası, kazan, pompa, tank, radyatör ve yangın ürünleri gösteriliyor."}
        </p>
      ) : null}
      {showroomFilter?.thermalFilter === "cooling" ? (
        <p className="catalog-thermal-hint mx-auto mb-4 max-w-3xl px-4 text-center text-sm">
          <strong className="catalog-thermal-hint__cool">
            {lang === "en" ? "Cooling" : "Soğutma"}
          </strong>
          {lang === "en"
            ? " — showing VRF / fancoil and air conditioning products."
            : " — VRF / fancoil ve klima ürünleri gösteriliyor."}
        </p>
      ) : null}
      {brandFilterLabel ? (
        <p className="catalog-brand-hint mx-auto mb-4 max-w-3xl px-4 text-center text-sm">
          {lang === "en" ? (
            <>
              Brand filter: <strong>{brandFilterLabel}</strong>
              {" — "}
              <button
                type="button"
                className="catalog-brand-hint__clear underline decoration-[rgba(255,191,0,0.55)] underline-offset-2 hover:text-[#ffbf00]"
                onClick={() => showroomFilter?.setBrandKey(null)}
              >
                Clear
              </button>
            </>
          ) : (
            <>
              <strong>{brandFilterLabel}</strong> markası seçili —{" "}
              <button
                type="button"
                className="catalog-brand-hint__clear underline decoration-[rgba(255,191,0,0.55)] underline-offset-2 hover:text-[#ffbf00]"
                onClick={() => showroomFilter?.setBrandKey(null)}
              >
                filtreyi kaldır
              </button>
            </>
          )}
        </p>
      ) : null}

      <div className="catalog-layout">
        <NumberedCategorySidebar
          activeCategory={activeCategory}
          onSelectCategory={(c) => setActiveCategory(c)}
          onShowAll={() => {
            setActiveCategory("all");
            showroomFilter?.setThermalFilter(null);
            showroomFilter?.setBrandKey(null);
          }}
        />
        <AnimatedProductGrid
          products={filteredProducts}
          transitionKey={gridTransitionKey}
          filterBlockedHint={products.length > 0 && filteredProducts.length === 0}
          lang={lang}
        />
      </div>
    </section>
  );
};

export default ProductEngine;
