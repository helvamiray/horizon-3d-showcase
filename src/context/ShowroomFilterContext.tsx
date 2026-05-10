import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { ProductCategory } from "@/data/products";
import type { ShowroomThermalFilter } from "@/lib/showroomThermalFilter";

export type ShowroomFilterContextValue = {
  brandKey: string | null;
  setBrandKey: Dispatch<SetStateAction<string | null>>;
  toggleBrandKey: (key: string) => void;
  /** Hero ürün bölgeleri → ürün kataloğunda tek seferlik kategori seçimi */
  pendingCatalogCategory: ProductCategory | null;
  setPendingCatalogCategory: Dispatch<SetStateAction<ProductCategory | null>>;
  /** MARKALAR ISITMA / SOĞUTMA — kategori setine göre global ürün filtresi */
  thermalFilter: ShowroomThermalFilter | null;
  setThermalFilter: Dispatch<SetStateAction<ShowroomThermalFilter | null>>;
  toggleThermalFilter: (mode: ShowroomThermalFilter) => void;
};

const ShowroomFilterContext = createContext<ShowroomFilterContextValue | null>(null);

export function ShowroomFilterProvider({ children }: { children: ReactNode }) {
  const [brandKey, setBrandKey] = useState<string | null>(null);
  const [pendingCatalogCategory, setPendingCatalogCategory] = useState<ProductCategory | null>(
    null,
  );
  const [thermalFilter, setThermalFilter] = useState<ShowroomThermalFilter | null>(null);

  const toggleBrandKey = useCallback((key: string) => {
    setBrandKey((prev) => (prev === key ? null : key));
  }, []);

  const toggleThermalFilter = useCallback((mode: ShowroomThermalFilter) => {
    setThermalFilter((prev) => (prev === mode ? null : mode));
  }, []);

  const value = useMemo(
    () =>
      ({
        brandKey,
        setBrandKey,
        toggleBrandKey,
        pendingCatalogCategory,
        setPendingCatalogCategory,
        thermalFilter,
        setThermalFilter,
        toggleThermalFilter,
      }) satisfies ShowroomFilterContextValue,
    [brandKey, toggleBrandKey, pendingCatalogCategory, thermalFilter, toggleThermalFilter],
  );

  return <ShowroomFilterContext.Provider value={value}>{children}</ShowroomFilterContext.Provider>;
}

export function useShowroomFilter(): ShowroomFilterContextValue {
  const ctx = useContext(ShowroomFilterContext);
  if (!ctx) {
    throw new Error("useShowroomFilter must be used within ShowroomFilterProvider");
  }
  return ctx;
}

export function useShowroomFilterOptional(): ShowroomFilterContextValue | null {
  return useContext(ShowroomFilterContext);
}
