/**
 * Expandable product cards — layout morph via Framer Motion (no video).
 */
import { useEffect, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Package, X } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/data/products";

export type ExpandableCardData = {
  layoutKey: string;
  title: string;
  description: string;
  src: string | null;
  productSlug: string;
  longDescription: string;
  specs: string[];
};

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

export function productToExpandableCardData(
  product: Product,
  layoutKey: string,
  categoryLabel: string,
): ExpandableCardData {
  const src =
    product.image && product.image !== "/placeholder.svg" ? product.image : null;
  return {
    layoutKey,
    title: product.name,
    description: categoryLabel,
    src,
    productSlug: product.id,
    longDescription: product.description,
    specs: product.specs,
  };
}

function CloseIcon({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="Kapat"
      className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <X className="h-4 w-4" strokeWidth={2} aria-hidden />
    </button>
  );
}

function CollapsedTile({
  card,
  variant,
  dimmed,
  onOpen,
  onTeklifAl,
}: {
  card: ExpandableCardData;
  variant: "grid" | "slider";
  dimmed: boolean;
  onOpen: () => void;
  onTeklifAl?: () => void;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <motion.div
      layoutId={`expand-card-${card.layoutKey}`}
      role="button"
      tabIndex={0}
      aria-expanded={false}
      aria-label={card.title}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      className={clsx(
        dimmed && "pointer-events-none opacity-0",
        variant === "slider" && "product-slider-card flex min-h-[268px] flex-col",
        variant === "grid" &&
          "expandable-catalog-card flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
      )}
      transition={{
        layout: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <motion.div
        layoutId={`expand-cover-${card.layoutKey}`}
        className={clsx(
          variant === "slider" && "product-slider-card__media",
          variant === "grid" &&
            "expandable-catalog-card__media flex shrink-0 items-center justify-center overflow-hidden border-b border-white/10 bg-black/35",
        )}
        transition={{
          layout: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
        }}
        style={variant === "grid" ? { height: 140 } : undefined}
      >
        {card.src ? (
          <img
            src={card.src}
            alt=""
            draggable={false}
            className={clsx(
              variant === "slider" ? "h-full w-full object-contain" : "max-h-full max-w-full object-contain",
            )}
          />
        ) : (
          <Package
            size={variant === "slider" ? 40 : 44}
            strokeWidth={1.25}
            aria-hidden
            className={clsx(
              variant === "slider" && "product-slider-card__placeholder text-slate-500/45",
              variant === "grid" && "text-slate-500/45",
            )}
          />
        )}
      </motion.div>

      <div
        className={clsx(
          variant === "slider" &&
            "product-slider-card__body flex min-h-0 flex-1 flex-col justify-between",
          variant === "grid" && "flex flex-1 flex-col px-4 pb-4 pt-3",
        )}
      >
        <div className={variant === "slider" ? "min-h-0 flex-1" : undefined}>
          <span
            className={clsx(
              "expandable-catalog-card__category",
              variant === "slider" && "product-slider-card__category",
              variant === "grid" &&
                "mb-1.5 block text-[9px] uppercase tracking-[0.14em] text-cyan-300/70",
            )}
            style={variant === "grid" ? { fontFamily: "var(--font-premium-mono)" } : undefined}
          >
            {card.description}
          </span>
          <h3
            className={clsx(
              variant === "slider" && "product-slider-card__title",
              variant === "grid" &&
                "line-clamp-2 text-[14px] font-bold leading-snug text-slate-50",
            )}
            style={
              variant === "grid" ? { fontFamily: "var(--font-premium-display)" } : undefined
            }
          >
            {card.title}
          </h3>
        </div>

        {variant === "slider" && onTeklifAl ? (
          <div className="mt-2 flex shrink-0 justify-center border-t border-white/[0.08] px-2 pb-2.5 pt-2">
            <button
              type="button"
              className="rounded-md border border-white/18 bg-white/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-100 transition-colors hover:border-emerald-400/40 hover:text-emerald-50"
              style={{ fontFamily: "var(--font-premium-mono)" }}
              onClick={(e) => {
                e.stopPropagation();
                onTeklifAl();
              }}
            >
              TEKLİF AL
            </button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function ExpandableCardDemo({
  items,
  variant,
  layoutGroupId,
}: {
  items: ExpandableCardData[];
  variant: "grid" | "slider";
  layoutGroupId: string;
}) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const activeItem = activeKey ? items.find((x) => x.layoutKey === activeKey) : undefined;

  const close = () => setActiveKey(null);

  const inspect = (slug: string) => {
    close();
    navigate({ to: "/urunler/$slug", params: { slug } });
  };

  const quote = () => {
    close();
    navigate({ to: "/iletisim" });
  };

  const quoteOnly = () => {
    navigate({ to: "/iletisim" });
  };

  useEffect(() => {
    if (!activeKey) return;
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setActiveKey(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activeKey]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (activeKey) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeKey]);

  const dur = reduced ? 0.12 : 0.28;

  if (items.length === 0) return null;

  const overlay =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {activeItem ? (
              <>
                <motion.div
                  key="expand-backdrop"
                  role="presentation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur }}
                  className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm"
                  onClick={close}
                />
                <div className="pointer-events-none fixed inset-0 z-[56] flex items-center justify-center p-4">
                  <motion.div
                    layoutId={`expand-card-${activeItem.layoutKey}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`expand-title-${activeItem.layoutKey}`}
                    className="pointer-events-auto relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/12 bg-neutral-900 shadow-2xl dark:bg-neutral-900"
                    transition={{
                      layout: { duration: reduced ? 0.15 : 0.38, ease: [0.22, 1, 0.36, 1] },
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CloseIcon onClose={close} />

                    <motion.div
                      layoutId={`expand-cover-${activeItem.layoutKey}`}
                      className="relative flex shrink-0 items-center justify-center overflow-hidden border-b border-white/10 bg-black/45"
                      style={{ height: 192 }}
                      transition={{
                        layout: {
                          duration: reduced ? 0.15 : 0.38,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      }}
                    >
                      {activeItem.src ? (
                        <img
                          src={activeItem.src}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <Package
                          className="text-slate-500/50"
                          size={56}
                          strokeWidth={1.2}
                          aria-hidden
                        />
                      )}
                    </motion.div>

                    <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6 pt-14">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400/85">
                        {activeItem.description}
                      </span>
                      <h2
                        id={`expand-title-${activeItem.layoutKey}`}
                        className="mt-2 text-xl font-bold tracking-tight text-white"
                        style={{ fontFamily: "var(--font-premium-display)" }}
                      >
                        {activeItem.title}
                      </h2>

                      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                        {activeItem.longDescription}
                      </p>

                      {activeItem.specs.length > 0 ? (
                        <div className="mt-5">
                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                            Teknik özellikler
                          </p>
                          <ul className="space-y-2.5">
                            {activeItem.specs.map((line, i) => (
                              <li
                                key={i}
                                className="border-l-2 border-cyan-500/35 pl-3 text-sm text-neutral-400"
                              >
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div
                        className={clsx(
                          "mt-8 flex flex-wrap gap-3",
                          variant === "slider" ? "justify-center" : "",
                        )}
                      >
                        {variant === "grid" ? (
                          <button
                            type="button"
                            className="rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-300/55 hover:bg-cyan-500/25"
                            style={{ fontFamily: "var(--font-premium-mono)" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              inspect(activeItem.productSlug);
                            }}
                          >
                            İNCELE
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="rounded-lg border border-white/18 bg-white/[0.06] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100 transition-colors hover:border-emerald-400/40 hover:text-emerald-50"
                          style={{ fontFamily: "var(--font-premium-mono)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            quote();
                          }}
                        >
                          TEKLİF AL
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <LayoutGroup id={layoutGroupId}>
      <div className="contents">
        {items.map((card) => (
          <CollapsedTile
            key={card.layoutKey}
            card={card}
            variant={variant}
            dimmed={activeKey === card.layoutKey}
            onOpen={() => setActiveKey(card.layoutKey)}
            onTeklifAl={variant === "slider" ? quoteOnly : undefined}
          />
        ))}
      </div>
      {overlay}
    </LayoutGroup>
  );
}
