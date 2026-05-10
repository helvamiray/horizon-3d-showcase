import type { Product, ProductCategory } from "@/data/products";
import { showroomBrandMatchesProductBrand } from "@/data/showroomCatalog";

/** ISITMA / SOĞUTMA showroom ↔ katalog köprüsü */
export type ShowroomThermalFilter = "heating" | "cooling";

export const SHOWROOM_THERMAL_HEATING_CATEGORIES: readonly ProductCategory[] = [
  "isi-pompasi",
  "kombi",
  "tank",
  "boru",
  "radyator",
  /** Yangın ürünleri HVAC tesisi ile birlikte; ISITMA’da kaybolmasın */
  "yangin",
];

export const SHOWROOM_THERMAL_COOLING_CATEGORIES: readonly ProductCategory[] = ["vrf", "klima"];

function categoryIsHeating(cat: ProductCategory): boolean {
  return (SHOWROOM_THERMAL_HEATING_CATEGORIES as readonly string[]).includes(cat);
}

function categoryIsCooling(cat: ProductCategory): boolean {
  return (SHOWROOM_THERMAL_COOLING_CATEGORIES as readonly string[]).includes(cat);
}

export function productMatchesShowroomThermal(
  product: Product,
  thermal: ShowroomThermalFilter | null,
): boolean {
  if (!thermal) return true;
  if (thermal === "heating") return categoryIsHeating(product.category);
  return categoryIsCooling(product.category);
}

/** MARKALAR ızgarasında göster: ürün listesinde bu marka + seçilen termal için en az bir eşleşme */
export function brandVisibleForShowroomThermal(
  brandKey: string,
  products: readonly Product[],
  thermal: ShowroomThermalFilter | null,
): boolean {
  if (!thermal) return true;
  for (const p of products) {
    if (!showroomBrandMatchesProductBrand(brandKey, p.brand)) continue;
    if (productMatchesShowroomThermal(p, thermal)) return true;
  }
  return false;
}
