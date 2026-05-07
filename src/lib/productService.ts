import { PRODUCTS, type Product, type ProductCategory } from "@/data/products";
import {
  productService as adminProductStore,
  type AdminProduct,
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

/** Maps catalog category to scene `componentKey`, hero video, and optional 3D preview. */
const PRODUCT_CATALOG_SYNC: Record<
  ProductCategory,
  { componentKey: string; video: string; preview3d?: Product["preview3d"] }
> = {
  vrf: { componentKey: "ac-units", video: "/videos/klima.mp4", preview3d: "ac" },
  "isi-pompasi": {
    componentKey: "heatpump",
    video: "/videos/isi_pompasi.mp4",
    preview3d: "heatpump",
  },
  kombi: { componentKey: "boiler", video: "/videos/kazan.mp4" },
  klima: { componentKey: "ac-units", video: "/videos/klima.mp4", preview3d: "ac" },
  radyator: { componentKey: "radiators", video: "/videos/kazan.mp4" },
  boru: { componentKey: "pump", video: "/videos/kazan.mp4" },
  tank: { componentKey: "tank", video: "/videos/kazan.mp4" },
  yangin: {
    componentKey: "fire-system",
    video: "/videos/yangin.mp4",
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
    video: sync.video,
    preview3d: sync.preview3d,
  };
};

export const getProducts = (): Product[] => {
  if (!isBrowser()) return PRODUCTS;
  const adminProducts = adminProductStore.getAll();
  if (adminProducts.length === 0) return PRODUCTS;
  return adminProducts.map(toLegacyProduct);
};

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
  /* Slider / legacy links use static catalog ids even when admin store replaces getProducts() */
  return PRODUCTS.find((p) => p.id === key) ?? null;
};
