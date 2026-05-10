/**
 * ProductSlider
 * ─────────────────────────────────────────────────────────────────────────
 * • Infinite auto-scroll: CSS `.animate-scroll` + `--product-slider-duration`.
 * • Hover (viewport veya şerit): animasyon `paused`.
 * • Kartlar: ExpandableCardDemo (layout genişleme, İNCELE / TEKLİF AL).
 */
import { useMemo, type CSSProperties } from "react";
import {
  ExpandableCardDemo,
  productToExpandableCardData,
} from "@/components/expandable/ExpandableCardDemo";
import { PRODUCTS, CATEGORY_LABEL } from "@/data/products";

/* ── Main section ───────────────────────────────────────────────── */
const ITEMS = [...PRODUCTS, ...PRODUCTS]; // double for seamless loop

const ProductSlider = () => {
  const items = useMemo(
    () =>
      ITEMS.map((product, i) =>
        productToExpandableCardData(
          product,
          `${product.id}-${i}`,
          CATEGORY_LABEL[product.category]?.tr ?? product.category,
        ),
      ),
    [],
  );

  return (
    <section className="product-slider-section">
      <div className="product-slider-fade product-slider-fade--left" aria-hidden />
      <div className="product-slider-fade product-slider-fade--right" aria-hidden />

      <div className="product-slider-viewport">
        <div
          className="product-slider-track animate-scroll"
          style={
            {
              "--product-slider-duration": `${PRODUCTS.length * 4}s`,
            } as CSSProperties
          }
        >
          <ExpandableCardDemo items={items} variant="slider" layoutGroupId="product-slider-expand" />
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
