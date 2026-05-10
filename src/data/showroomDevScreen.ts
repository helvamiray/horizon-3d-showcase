/**
 * Dev Ekran — Vega showroom ile aynı mantık: arka plan görselindeki ekran alanı üzerinde
 * yüzde ile tanımlı şeffaf bölgeler, tıklanınca Horizon ürün detayı.
 * Hero’da yalnızca alt sıra üç bölge (ısı pompası, kazan, yangın).
 */
export type ShowroomDevScreenSlot = {
  readonly id: string;
  readonly productId: string;
  /** Vega `SCREEN_HOTSPOTS`: Dev Ekran kutusu içinde % (sol, üst, genişlik, yükseklik) */
  readonly spot: { left: number; top: number; w: number; h: number };
};

export const SHOWROOM_DEV_SCREEN_SLOTS: readonly ShowroomDevScreenSlot[] = [
  {
    id: "dev-boiler",
    productId: "p-boiler-buderus",
    spot: { left: 10, top: 39, w: 26, h: 34 },
  },
  {
    id: "dev-heatpump",
    productId: "p-heatpump-daikin",
    spot: { left: 37, top: 32, w: 26, h: 36 },
  },
  {
    id: "dev-fire",
    productId: "p-fire-tyco",
    spot: { left: 67, top: 39, w: 26, h: 34 },
  },
] as const;
