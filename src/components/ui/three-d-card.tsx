/**
 * ThreeDCard — layered translateZ on media block only; footer CTAs stay flat (no tilt).
 */
import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { IconShoppingCart } from "@tabler/icons-react";
import clsx from "clsx";
import { toast } from "sonner";
import { CATEGORY_LABEL, type Product } from "@/data/products";
import { useCart } from "@/providers/CartContext";
import { useLanguage } from "@/i18n/LanguageContext";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, reducedMotionSnapshot, () => false);
}

export function CardItem({
  translateZ,
  className,
  children,
}: {
  translateZ: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={clsx(className)} style={{ transform: `translateZ(${translateZ}px)` }}>
      {children}
    </div>
  );
}

function briefSummary(text: string, max = 118): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const last = cut.lastIndexOf(" ");
  return (last > 40 ? cut.slice(0, last) : cut).trimEnd() + "…";
}

const SHELL_CLASS =
  "relative isolate flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/35 backdrop-blur-md transition-[box-shadow,border-color] duration-300 dark:border-white/[0.1] dark:bg-black/40 dark:hover:border-cyan-400/20 dark:hover:shadow-[0_0_36px_-10px_rgba(34,211,238,0.14)]";

export function ThreeDCard({
  product,
  categoryLabel,
  cardIndex,
}: {
  product: Product;
  categoryLabel: string;
  /** Liste içinde ilk kart tek “yüksek öncelik” görsel (geri kalanı lazy). */
  cardIndex: number;
}) {
  const { add, openCart } = useCart();
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovering, setHovering] = useState(false);
  const pendingTilt = useRef({ rx: 0, ry: 0 });
  const rafRef = useRef<number | null>(null);

  const hasImg = Boolean(product.image && product.image !== "/placeholder.svg");

  const flushTilt = useCallback(() => {
    rafRef.current = null;
    setTilt({ ...pendingTilt.current });
  }, []);

  const onMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const el = shellRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const w = Math.max(r.width, 1);
      const h = Math.max(r.height, 1);
      const px = (e.clientX - r.left) / w - 0.5;
      const py = (e.clientY - r.top) / h - 0.5;
      pendingTilt.current = { rx: py * -5.5, ry: px * 8 };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(flushTilt);
      }
    },
    [reduced, flushTilt],
  );

  const onLeave = useCallback(() => {
    setHovering(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const onEnter = useCallback(() => {
    setHovering(true);
  }, []);

  const tiltTransform = reduced
    ? undefined
    : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`;

  const tiltLayerStyle: CSSProperties = reduced
    ? { transformStyle: "preserve-3d" }
    : {
        transform: tiltTransform,
        transformStyle: "preserve-3d",
        transition: hovering ? "none" : "transform 220ms ease-out",
        willChange: "transform",
        backfaceVisibility: "hidden",
      };

  const summaryLine = `${categoryLabel} · ${briefSummary(product.description)}`;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    add(product);
    setTimeout(openCart, 400);
    toast.success(`${product.name} ${t("toast.added")}`, {
      action: { label: t("toast.openCart"), onClick: () => openCart() },
    });
  };

  return (
    <article className="expandable-catalog-card catalog-three-d-card h-full w-full [perspective:1000px]">
      <div
        ref={shellRef}
        className={clsx(SHELL_CLASS)}
        style={{ transformStyle: "preserve-3d" }}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="flex shrink-0 flex-col px-4 pb-2 pt-4" style={tiltLayerStyle}>
          <CardItem
            translateZ={100}
            className="relative mb-3 flex min-h-[132px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.06] bg-black/30"
          >
            {hasImg ? (
              <img
                src={product.image}
                alt=""
                className="max-h-36 w-full object-contain"
                draggable={false}
                decoding="async"
                loading={cardIndex === 0 ? "eager" : "lazy"}
                fetchPriority={cardIndex === 0 ? "high" : "low"}
              />
            ) : (
              <Package className="text-slate-500/45" size={48} strokeWidth={1.2} aria-hidden />
            )}
          </CardItem>

          <CardItem translateZ={50} className="min-w-0 shrink-0">
            <h3
              className="text-[15px] font-bold leading-snug tracking-tight text-neutral-50"
              style={{ fontFamily: "var(--font-premium-display)" }}
            >
              {product.name}
            </h3>
          </CardItem>
        </div>

        <div className="relative z-10 mt-2 min-h-0 flex-1 px-4 pb-2">
          <p
            className="line-clamp-3 text-[13px] leading-relaxed tracking-wide text-neutral-400"
            style={{ fontFamily: "var(--font-premium-body)" }}
          >
            {summaryLine}
          </p>
        </div>

        <div className="relative z-10 mt-auto flex shrink-0 flex-wrap items-center gap-2 border-t border-white/[0.07] px-4 pb-4 pt-4">
          <Link
            to="/urunler/$slug"
            params={{ slug: product.id }}
            className="inline-flex items-center rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 transition-colors hover:border-cyan-300/55 hover:bg-cyan-500/18"
            style={{ fontFamily: "var(--font-premium-mono)" }}
          >
            DETAYLARI GÖR
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-50 transition-colors hover:border-emerald-300/55 hover:bg-emerald-500/26 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/35"
            style={{ fontFamily: "var(--font-premium-mono)" }}
            onClick={handleAddToCart}
            aria-label={`${product.name} — ${t("card.add")}`}
          >
            <IconShoppingCart size={15} stroke={1.75} aria-hidden />
            {t("card.add")}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ThreeDCardDemo({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((p, i) => (
        <ThreeDCard key={p.id} product={p} categoryLabel={CATEGORY_LABEL[p.category].tr} cardIndex={i} />
      ))}
    </>
  );
}

export default ThreeDCardDemo;
