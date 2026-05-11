import { PRODUCTS, type Product, type ProductCategory } from "@/data/products";
import {
  ADMIN_PRODUCT_STORAGE_KEY,
  productService as adminProductStore,
  VEGA_CATALOG_UPDATED_EVENT,
  type AdminProduct,
  type ProductSpec,
} from "@/lib/adminProductService";

const ALL_CATEGORIES: ProductCategory[] = [
  "vrf",
  "isi-pompasi",
  "kombi",
  "klima",
  "radyator",
  "boru",
  "tank",
  "yangin",
];

/** Maps catalog category to scene `componentKey` and optional 3D preview. */
const PRODUCT_CATALOG_SYNC: Record<
  ProductCategory,
  { componentKey: string; preview3d?: Product["preview3d"] }
> = {
  vrf: { componentKey: "ac-units", preview3d: "ac" },
  "isi-pompasi": {
    componentKey: "heatpump",
    preview3d: "heatpump",
  },
  kombi: { componentKey: "boiler" },
  klima: { componentKey: "ac-units", preview3d: "ac" },
  radyator: { componentKey: "radiators" },
  boru: { componentKey: "pump" },
  tank: { componentKey: "tank" },
  yangin: {
    componentKey: "fire-system",
    preview3d: "fire-extinguisher",
  },
};

const isBrowser = () => typeof window !== "undefined";

/** Coerce admin free-text / legacy category values into a valid `ProductCategory`. */
export function normalizeProductCategory(raw: string): ProductCategory {
  const t = raw.trim();
  if (ALL_CATEGORIES.includes(t as ProductCategory)) return t as ProductCategory;
  const lower = t.toLowerCase();
  const aliases: Record<string, ProductCategory> = {
    vrf: "vrf",
    "heat pump": "isi-pompasi",
    heatpump: "isi-pompasi",
    "isi pompasi": "isi-pompasi",
    "isı pompası": "isi-pompasi",
    boiler: "kombi",
    kombi: "kombi",
    ac: "klima",
    klima: "klima",
    radiator: "radyator",
    radyatör: "radyator",
    pipe: "boru",
    pump: "boru",
    fire: "yangin",
    yangin: "yangin",
    tank: "tank",
  };
  return aliases[lower] ?? "boru";
}

const toLegacyProduct = (p: AdminProduct): Product => {
  const category = normalizeProductCategory(p.category);
  const sync = PRODUCT_CATALOG_SYNC[category];
  const nameEn = p.nameEn?.trim() || p.name;
  const descriptionEn = p.descriptionEn?.trim() || p.description;
  const specLines = p.specs.map((s) => `${s.key}: ${s.value}`.trim());
  return {
    id: p.slug.trim() || p.id,
    name: p.name,
    name_en: nameEn,
    brand: p.brand,
    category,
    componentKey: sync.componentKey,
    description: p.description,
    description_en: descriptionEn,
    specs: specLines,
    specs_en: specLines,
    image: p.images[0] ?? "/placeholder.svg",
    preview3d: sync.preview3d,
    price: p.price,
    currency: p.currency,
  };
};

const CATALOG_ONLY_ADMIN_STAMP = "1970-01-01T00:00:00.000Z";

function catalogSpecsLinesToSpecs(lines: readonly string[]): ProductSpec[] {
  const cleaned = lines.map((l) => l.trim()).filter(Boolean);
  if (cleaned.length === 0) return [{ key: "", value: "" }];
  return cleaned.map((line) => {
    const i = line.indexOf(":");
    if (i === -1) return { key: "Özellik", value: line };
    return { key: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
  });
}

/** Statik `PRODUCTS` satırı → admin tablo/form şekli (yerelde kayıt yokken). */
export function catalogProductToAdminRow(p: Product): AdminProduct {
  const short =
    p.description.length > 160 ? `${p.description.slice(0, 157)}…` : p.description;
  return {
    id: p.id,
    name: p.name,
    nameEn: p.name_en,
    slug: p.id,
    category: p.category,
    brand: p.brand,
    description: p.description,
    descriptionEn: p.description_en,
    shortDescription: short,
    price: p.price,
    currency: p.currency,
    images: p.image ? [p.image] : [],
    specs: catalogSpecsLinesToSpecs(p.specs),
    inStock: true,
    featured: false,
    createdAt: CATALOG_ONLY_ADMIN_STAMP,
    updatedAt: CATALOG_ONLY_ADMIN_STAMP,
  };
}

/**
 * Admin ürün listesi: önce anasayfa statik katalog sırası (yerel güncelleme ile birleşik),
 * ardından yalnızca admin tarafından eklenen ürünler.
 */
export function getAdminMergedProductRows(): AdminProduct[] {
  if (!isBrowser()) {
    return PRODUCTS.map(catalogProductToAdminRow);
  }
  const stored = adminProductStore.getStoredRaw();
  const usedStoredIds = new Set<string>();

  const catalogRows: AdminProduct[] = PRODUCTS.map((p) => {
    const override = stored.find((a) => a.id === p.id || a.slug.trim() === p.id);
    if (override) {
      usedStoredIds.add(override.id);
      return { ...override };
    }
    return catalogProductToAdminRow(p);
  });

  const extras = stored
    .filter((a) => !usedStoredIds.has(a.id))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  return [...catalogRows, ...extras];
}

export const getProducts = (): Product[] => {
  if (!isBrowser()) return PRODUCTS;
  const adminProducts = adminProductStore.getAll();
  if (adminProducts.length === 0) return PRODUCTS;

  const fromAdmin = adminProducts.map(toLegacyProduct);
  const adminIds = new Set(fromAdmin.map((p) => p.id));
  const rest = PRODUCTS.filter((p) => !adminIds.has(p.id));
  return [...fromAdmin, ...rest];
};

/** Refresh catalog listeners after admin saves (same tab) or storage sync (other tabs). */
export function subscribeVegaProductCatalog(onChange: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => onChange();
  window.addEventListener(VEGA_CATALOG_UPDATED_EVENT, handler);
  const onStorage = (e: StorageEvent) => {
    if (e.key === ADMIN_PRODUCT_STORAGE_KEY || e.key === null) handler();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(VEGA_CATALOG_UPDATED_EVENT, handler);
    window.removeEventListener("storage", onStorage);
  };
}

export const getProductById = (slugOrId: string): Product | null => {
  const key = slugOrId.trim();
  const products = getProducts();
  const direct = products.find((p) => p.id === key);
  if (direct) return direct;
  if (isBrowser()) {
    const admin = adminProductStore
      .getAll()
      .find((a) => a.id === key || a.slug === key);
    if (admin) return toLegacyProduct(admin);
  }
  /* Slider / legacy links use static ids when merged catalog omits a slug */
  return PRODUCTS.find((p) => p.id === key) ?? null;
};
