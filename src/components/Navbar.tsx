import { useState, useEffect, useCallback, useMemo, type MouseEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { IconMenu2 } from "@tabler/icons-react";
import { ChevronDown, Moon, ShoppingCart, Sun } from "lucide-react";
import { Drawer, DrawerHeader, DrawerItems, drawerTheme } from "flowbite-react";
import { useCart } from "@/providers/CartContext";
import { useUiTheme } from "@/context/UiThemeContext";
import { useShowroomFilterOptional } from "@/context/ShowroomFilterContext";
import { navigateToHashSection } from "@/utils/navigateToHashSection";
import type { ProductCategory } from "@/data/products";

function buildVegaDrawerTheme(isLight: boolean) {
  const panelBase = `${drawerTheme.root.base} z-[140] !max-w-[min(100vw,22rem)] w-[min(100vw,22rem)] !backdrop-blur-xl !border-l !p-0 shadow-2xl`;
  const panel = isLight
    ? `${panelBase} !bg-white !border-zinc-200/95`
    : `${panelBase} !bg-black/95 !border-white/10`;
  const backdrop = isLight
    ? "fixed inset-0 z-[135] bg-black/30 backdrop-blur-sm"
    : "fixed inset-0 z-[135] bg-black/55 backdrop-blur-xl";
  const titleText = isLight
    ? `${drawerTheme.header.inner.titleText} !mb-0 flex w-full items-center border-b border-zinc-200 px-4 py-4 text-lg font-bold tracking-wide text-zinc-900`
    : `${drawerTheme.header.inner.titleText} !mb-0 flex w-full items-center border-b border-white/10 px-4 py-4 text-lg font-bold tracking-wide text-white`;
  const closeButton = isLight
    ? `${drawerTheme.header.inner.closeButton} !text-zinc-700 hover:!bg-zinc-100 hover:!text-zinc-950`
    : `${drawerTheme.header.inner.closeButton} !text-slate-300 hover:!bg-white/10 hover:!text-white`;
  const titleIcon = isLight ? "me-2.5 h-4 w-4 shrink-0 text-zinc-900" : "me-2.5 h-4 w-4 shrink-0 text-white";
  const closeIcon = isLight ? "h-4 w-4 shrink-0 text-zinc-800" : "h-4 w-4 shrink-0 text-slate-200";

  return {
    ...drawerTheme,
    root: {
      ...drawerTheme.root,
      base: panel,
      backdrop,
    },
    header: {
      ...drawerTheme.header,
      inner: {
        ...drawerTheme.header.inner,
        titleText,
        closeButton,
        titleIcon,
        closeIcon,
      },
    },
  };
}

function VegaLogoMark() {
  return (
    <>
      <span
        aria-hidden="true"
        className="flex-shrink-0 rounded-full"
        style={{
          width: "7px",
          height: "7px",
          background: "var(--cyber-green, #00ff88)",
        }}
      />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <polygon
          points="16,3 29,27 3,27"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <polygon points="16,11 23,24 9,24" fill="currentColor" opacity="0.35" />
      </svg>
      <div className="grav-nav-wordmark">
        <span
          className="grav-nav-brand"
          style={{
            fontFamily: "var(--font-premium-display)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Vega
        </span>
        <span
          className="grav-nav-sub"
          style={{
            fontFamily: "var(--font-premium-display)",
            letterSpacing: "0.01em",
          }}
        >
          İklimlendirme
        </span>
      </div>
    </>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [productsAccordionOpen, setProductsAccordionOpen] = useState(false);
  const { count, openCart } = useCart();
  const { mode, toggleMode } = useUiTheme();
  const navigate = useNavigate();
  const showroomFilter = useShowroomFilterOptional();

  const isLight = mode === "light";

  const vegaDrawerTheme = useMemo(() => buildVegaDrawerTheme(isLight), [isLight]);

  const drawerNavBtn = useMemo(
    () =>
      isLight
        ? "w-full rounded-lg px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-zinc-900 transition-colors hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/35"
        : "w-full rounded-lg px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-white transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45",
    [isLight],
  );

  const drawerSubBtn = useMemo(
    () =>
      isLight
        ? "w-full rounded-md px-4 py-3.5 text-left text-base font-semibold uppercase tracking-[0.08em] text-zinc-800 transition-colors hover:text-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700/30"
        : "w-full rounded-md px-4 py-3.5 text-left text-base font-semibold uppercase tracking-[0.08em] text-white/90 transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35",
    [isLight],
  );

  const drawerAccordionWrap = isLight
    ? "rounded-lg border border-zinc-200 bg-zinc-50/90"
    : "rounded-lg border border-white/12 bg-white/[0.04]";

  const drawerAccordionBtn = isLight
    ? "flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-zinc-900 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-700/35"
    : "flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-xl font-bold uppercase tracking-[0.06em] text-white transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/45";

  const drawerAccordionChevron = isLight ? "text-zinc-600" : "text-slate-400";

  const drawerAccordionInner = isLight ? "border-t border-zinc-200" : "border-t border-white/10";

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    setProductsAccordionOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isOpen]);

  const goHomeAndClose = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate({ to: "/" });
    closeDrawer();
  };

  const goHashAndClose = (id: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateToHashSection(navigate, id);
    closeDrawer();
  };

  const goCategoryAndClose = (category: ProductCategory) => {
    showroomFilter?.setPendingCatalogCategory(category);
    navigateToHashSection(navigate, "urunler");
    closeDrawer();
  };

  return (
    <nav
      className={`grav-navbar${scrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label="Ana navigasyon"
    >
      <Link
        to="/"
        className="grav-nav-logo min-w-0"
        aria-label="Vega İklimlendirme Ana Sayfa"
        preload="intent"
        preloadDelay={0}
        onClick={() => {
          if (isOpen) closeDrawer();
        }}
      >
        <VegaLogoMark />
      </Link>

      <div className="grav-nav-actions shrink-0">
        <button
          type="button"
          className="grav-nav-theme"
          onClick={toggleMode}
          aria-label={mode === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
        >
          {mode === "light" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
        </button>
        <button className="grav-nav-cart" onClick={openCart} aria-label={`Sepet — ${count} ürün`}>
          <ShoppingCart size={18} />
          {count > 0 && (
            <span className="grav-cart-badge" aria-hidden="true">
              {count}
            </span>
          )}
        </button>
        <button
          type="button"
          className="grav-nav-cta"
          onClick={() => navigateToHashSection(navigate, "iletisim")}
          aria-label="Teklif Al — İletişim bölümüne git"
        >
          Teklif Al
        </button>
        <button
          type="button"
          className={`flex items-center justify-center rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 ${isLight ? "text-zinc-900 hover:bg-black/[0.06]" : "text-white hover:bg-white/10"}`}
          aria-expanded={isOpen}
          aria-controls="vega-flowbite-drawer"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <IconMenu2 size={28} stroke={1.75} className="shrink-0" aria-hidden />
        </button>
      </div>

      <Drawer
        id="vega-flowbite-drawer"
        open={isOpen}
        onClose={closeDrawer}
        position="right"
        theme={vegaDrawerTheme}
        key={mode}
        className="outline-none"
      >
        <DrawerHeader title="Menü" />
        <DrawerItems className="overflow-y-auto px-3 pb-8 pt-2">
          <nav className="flex flex-col gap-2" aria-label="Sayfa bağlantıları">
            <Link to="/" preload="intent" preloadDelay={0} className={drawerNavBtn} onClick={goHomeAndClose}>
              ANASAYFA
            </Link>
            <a href="/#hakkimizda" className={drawerNavBtn} onClick={(e) => goHashAndClose("hakkimizda", e)}>
              HAKKIMIZDA
            </a>

            <div className={drawerAccordionWrap}>
              <button
                type="button"
                className={drawerAccordionBtn}
                aria-expanded={productsAccordionOpen}
                onClick={() => setProductsAccordionOpen((o) => !o)}
              >
                ÜRÜNLER
                <ChevronDown
                  className={`size-5 shrink-0 ${drawerAccordionChevron} transition-transform duration-200 ${productsAccordionOpen ? "rotate-180" : ""}`}
                  aria-hidden
                  strokeWidth={2}
                />
              </button>
              {productsAccordionOpen ? (
                <div className={`flex flex-col gap-1 px-2 pb-3 pt-1 ${drawerAccordionInner}`}>
                  <button type="button" className={drawerSubBtn} onClick={() => goCategoryAndClose("klima")}>
                    Klima
                  </button>
                  <button type="button" className={drawerSubBtn} onClick={() => goCategoryAndClose("isi-pompasi")}>
                    Isı Pompası
                  </button>
                  <button type="button" className={drawerSubBtn} onClick={() => goCategoryAndClose("vrf")}>
                    Fancoil
                  </button>
                  <button type="button" className={drawerSubBtn} onClick={() => goCategoryAndClose("kombi")}>
                    Kazan
                  </button>
                </div>
              ) : null}
            </div>

            <a href="/#projeler" className={drawerNavBtn} onClick={(e) => goHashAndClose("projeler", e)}>
              PROJELERİMİZ
            </a>
            <a href="/#iletisim" className={drawerNavBtn} onClick={(e) => goHashAndClose("iletisim", e)}>
              İLETİŞİM
            </a>
          </nav>
        </DrawerItems>
      </Drawer>
    </nav>
  );
}

export default Navbar;
