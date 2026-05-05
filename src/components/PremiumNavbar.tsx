import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { useCart } from "@/providers/CartContext";
import { useLanguage } from "@/i18n/LanguageContext";

const NAV_CATS = [
  { href: "#systems", label: "Klima",                    labelEn: "AC" },
  { href: "#systems", label: "Fancoil",                  labelEn: "Fancoil" },
  { href: "#systems", label: "Isı Pompası",              labelEn: "Heat Pump" },
  { href: "#systems", label: "Kazan",                    labelEn: "Boiler" },
  { href: "#systems", label: "Baylar ve Genleşme Tankı", labelEn: "Expansion" },
  { href: "#systems", label: "Pompa ve Hüloher",         labelEn: "Pumps" },
  { href: "#hakkimizda", label: "Yardım İşıma",          labelEn: "Support" },
];

const PremiumNavbar = () => {
  const { count, openCart } = useCart();
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (count > prevCountRef.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCountRef.current = count;
  }, [count]);

  return (
    <>
      <nav
        className={`pnav${scrolled ? " scrolled" : ""}`}
        aria-label="Ana navigasyon"
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "0 2rem",
            height: "64px",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* ── Logo ── */}
          <a
            href="#"
            aria-label="Vega Enerji — Ana Sayfa"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            {/* Diamond mark */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 2 L28 15 L15 28 L2 15 Z"
                fill="none"
                stroke="var(--navy-primary)"
                strokeWidth="2"
              />
              <path
                d="M15 6 L24 15 L15 24 L6 15 Z"
                fill="var(--navy-primary)"
              />
            </svg>
            <div style={{ lineHeight: 1.15 }}>
              <div
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 800,
                  fontSize: "0.9375rem",
                  letterSpacing: "0.2em",
                  color: "var(--navy-primary)",
                }}
              >
                VEGA
              </div>
              <div
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 300,
                  fontSize: "0.5625rem",
                  letterSpacing: "0.35em",
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                ENERJİ
              </div>
            </div>
          </a>

          {/* ── Center product category nav links ── */}
          <nav
            aria-label="Ürün kategorileri"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
            }}
            className="hidden lg:flex"
          >
            {NAV_CATS.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className="pnav-link"
                style={{ padding: "0.25rem 0.875rem" }}
              >
                {lang === "tr" ? cat.label : cat.labelEn}
              </a>
            ))}
          </nav>

          {/* ── Right controls ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              marginLeft: "auto",
              flexShrink: 0,
            }}
          >
            {/* Language toggle — minimal */}
            <div
              style={{
                display: "flex",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                overflow: "hidden",
                marginRight: "0.5rem",
              }}
              className="hidden sm:flex"
            >
              {(["tr", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  style={{
                    padding: "0.3rem 0.625rem",
                    background: lang === l ? "var(--navy-primary)" : "transparent",
                    color: lang === l ? "#fff" : "#64748b",
                    fontFamily: "var(--font-premium-display)",
                    fontWeight: 700,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search icon */}
            <button
              type="button"
              onClick={() => document.querySelector<HTMLInputElement>("[data-search]")?.focus()}
              aria-label="Ara"
              style={iconBtnStyle}
              className="hidden md:grid"
            >
              <Search size={16} />
            </button>

            {/* Cart icon with badge */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Sepetim"
              style={{ ...iconBtnStyle, position: "relative" }}
            >
              <ShoppingBag
                size={16}
                style={{
                  transform: cartBounce ? "scale(1.35)" : "scale(1)",
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              />
              {count > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    width: "17px",
                    height: "17px",
                    borderRadius: "50%",
                    background: "var(--gold)",
                    color: "var(--navy-deep)",
                    fontSize: "0.5625rem",
                    fontWeight: 800,
                    display: "grid",
                    placeItems: "center",
                    border: "2px solid #fff",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger — mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileOpen}
              style={iconBtnStyle}
              className="lg:hidden"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            style={{
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              padding: "1rem 2rem 1.5rem",
            }}
          >
            {NAV_CATS.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "0.625rem 0",
                  borderBottom: "1px solid #f1f5f9",
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "var(--navy-primary)",
                  textDecoration: "none",
                }}
              >
                {lang === "tr" ? cat.label : cat.labelEn}
              </a>
            ))}
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              {(["tr", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  style={{
                    padding: "0.35rem 0.875rem",
                    background: lang === l ? "var(--navy-primary)" : "transparent",
                    color: lang === l ? "#fff" : "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontFamily: "var(--font-premium-display)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const iconBtnStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  background: "transparent",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  color: "var(--navy-primary)",
  transition: "all 0.18s",
};

export default PremiumNavbar;
