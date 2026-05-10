export type ProductCurrency = "TRY" | "USD" | "EUR";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  /** Optional; public catalog falls back to `name` when empty. */
  nameEn?: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  /** Optional; public catalog falls back to `description` when empty. */
  descriptionEn?: string;
  shortDescription: string;
  price?: number;
  currency?: ProductCurrency;
  images: string[];
  specs: ProductSpec[];
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "vega_products";

/** Same-tab listeners (`storage` only fires across tabs). */
export const VEGA_CATALOG_UPDATED_EVENT = "vega-catalog-updated";

const isBrowser = () => typeof window !== "undefined";

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `p-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const safeParse = (raw: string | null): AdminProduct[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as AdminProduct[];
  } catch {
    return [];
  }
};

const read = (): AdminProduct[] => {
  if (!isBrowser()) return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
};

const write = (products: AdminProduct[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(VEGA_CATALOG_UPDATED_EVENT));
};

const sortByDateDesc = (products: AdminProduct[]) =>
  [...products].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

export const productService = {
  /** Yerel depodaki sıra (birleşik katalog görünümü için). */
  getStoredRaw: (): AdminProduct[] => read(),

  getAll: (): AdminProduct[] => sortByDateDesc(read()),

  getById: (id: string): AdminProduct | null => {
    const product = read().find((p) => p.id === id);
    return product ?? null;
  },

  /**
   * Anasayfa statik `PRODUCTS` satırı — ilk kayıtta depoya yazılır (`id` katalog id ile sabitlenir).
   */
  upsertCatalogProduct: (
    catalogProductId: string,
    data: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">,
  ): AdminProduct => {
    const current = read();
    const idx = current.findIndex(
      (p) => p.id === catalogProductId || p.slug.trim() === catalogProductId,
    );
    const now = new Date().toISOString();
    if (idx >= 0) {
      const updated: AdminProduct = {
        ...current[idx],
        ...data,
        id: catalogProductId,
        updatedAt: now,
      };
      current[idx] = updated;
      write(current);
      return updated;
    }
    const created: AdminProduct = {
      ...data,
      id: catalogProductId,
      createdAt: now,
      updatedAt: now,
    };
    write([...current, created]);
    return created;
  },

  create: (product: Omit<AdminProduct, "id" | "createdAt" | "updatedAt">): AdminProduct => {
    const now = new Date().toISOString();
    const created: AdminProduct = {
      ...product,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const next = [...read(), created];
    write(next);
    return created;
  },

  update: (id: string, updates: Partial<AdminProduct>): AdminProduct => {
    const current = read();
    const idx = current.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error("Product not found");
    }
    const updated: AdminProduct = {
      ...current[idx],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    current[idx] = updated;
    write(current);
    return updated;
  },

  delete: (id: string): void => {
    write(
      read().filter((p) => p.id !== id && p.slug.trim() !== id.trim()),
    );
  },
};

export const ADMIN_PRODUCT_STORAGE_KEY = STORAGE_KEY;
