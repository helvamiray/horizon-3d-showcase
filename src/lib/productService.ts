import { PRODUCTS, type Product } from "@/data/products";
import type { AdminProduct } from "@/lib/adminProductService";

const STORAGE_KEY = "vega_products";

const isBrowser = () => typeof window !== "undefined";

const safeParse = (raw: string | null): AdminProduct[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AdminProduct[]) : [];
  } catch {
    return [];
  }
};

const toLegacyPrice = (price?: number, currency?: "TRY" | "USD" | "EUR") => {
  if (typeof price !== "number") return "-";
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "EUR " : "₺ ";
  return `${symbol}${price.toLocaleString("tr-TR")}`;
};

const toLegacyProduct = (p: AdminProduct): Product => ({
  id: p.id,
  name: p.name,
  name_en: p.name,
  brand: p.brand,
  category: "boru",
  componentKey: "manifold",
  description: p.description,
  description_en: p.description,
  specs: p.specs.map((s) => `${s.key}: ${s.value}`),
  specs_en: p.specs.map((s) => `${s.key}: ${s.value}`),
  image: p.images[0] ?? "/placeholder.svg",
  video: "/videos/isi_pompasi.mp4",
  preview3d: undefined,
});

export const getProducts = (): Product[] => {
  if (!isBrowser()) return PRODUCTS;
  const adminProducts = safeParse(window.localStorage.getItem(STORAGE_KEY));
  if (adminProducts.length === 0) return PRODUCTS;
  return adminProducts.map(toLegacyProduct);
};

export const getProductById = (id: string): Product | null => {
  return getProducts().find((p) => p.id === id) ?? null;
};
