import type { NavigateFn } from "@tanstack/react-router";

import type { Product, ProductCategory } from "@/data/products";
import { getMainScrollY, scrollMainDocumentTo } from "@/lib/smoothScroll";

/** Dev ekran hotspotları: kazan dairesi / ısı pompası / yangın — geri dönüşünce üst showroom */
const SHOWROOM_TOP_BACK_CATEGORIES = new Set<ProductCategory>(["kombi", "isi-pompasi", "yangin"]);

export function productBackNavigationIsHomeTop(product: Product | null | undefined): boolean {
  return Boolean(product && SHOWROOM_TOP_BACK_CATEGORIES.has(product.category));
}

/** Ana sayfa en üstü (showroom başlangıcı); Lenis’te anında. */
function scrollHomeTopImmediate(): void {
  scrollMainDocumentTo(0);
}

function navigateToHomeClearHash(navigate: NavigateFn): void {
  navigate({
    to: "/",
    resetScroll: false,
    hashScrollIntoView: false,
  });

  queueMicrotask(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollHomeTopImmediate();
      });
    });
  });
}

/** `#urunler` DOM’a girince Lenis/native ile anında kaydır (smooth scroll yok). */
function scrollCatalogSectionIntoViewImmediate(): boolean {
  const el = document.getElementById("urunler");
  if (!el) return false;
  const y = el.getBoundingClientRect().top + getMainScrollY();
  scrollMainDocumentTo(Math.max(0, y));
  return true;
}

function navigateToCatalogGrid(navigate: NavigateFn): void {
  navigate({
    to: "/",
    hash: "urunler",
    resetScroll: false,
    hashScrollIntoView: false,
  });

  queueMicrotask(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollCatalogSectionIntoViewImmediate()) return;

        const deadline = Date.now() + 8000;
        const id = window.setInterval(() => {
          if (scrollCatalogSectionIntoViewImmediate() || Date.now() > deadline) {
            clearInterval(id);
          }
        }, 48);
      });
    });
  });
}

/**
 * Ürün detayından dönüş:
 * - Kazan / ısı pompası / yangın → ana sayfa **üstü** (Dev Ekran showroom başlangıcı).
 * - Diğer ürünler → `#urunler` katalog ızgarası (hash ile tutarlı; uzun smooth Lenis yok).
 */
export function navigateBackToCatalog(navigate: NavigateFn, product?: Product | null): void {
  if (productBackNavigationIsHomeTop(product)) {
    navigateToHomeClearHash(navigate);
    return;
  }

  navigateToCatalogGrid(navigate);
}
