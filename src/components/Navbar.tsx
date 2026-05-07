import { useState, useEffect, type MouseEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Moon, ShoppingCart, Sun } from "lucide-react";
import { useCart } from "@/providers/CartContext";
import { useUiTheme } from "@/context/UiThemeContext";
import { navigateToHashSection } from "@/utils/navigateToHashSection";

const HASH_LINKS: { label: string; id: string }[] = [
  { label: "Hakkımızda", id: "hakkimizda" },
  { label: "Ürünler", id: "urunler" },
  { label: "İletişim", id: "iletisim" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const { mode, toggleMode } = useUiTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHashNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    navigateToHashSection(navigate, id);
  };

  return (
    <nav
      className={`grav-navbar${scrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label="Ana navigasyon"
    >
      <Link to="/" className="grav-nav-logo" aria-label="Vega İklimlendirme Ana Sayfa" preload="intent" preloadDelay={0}>
        <span
          aria-hidden="true"
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--cyber-green, #00ff88)",
            flexShrink: 0,
            animation: "status-blink 2.2s ease-in-out infinite",
          }}
        />
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
            style={{ fontFamily: "var(--font-premium-display)", fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            Vega
          </span>
          <span className="grav-nav-sub" style={{ fontFamily: "var(--font-premium-display)", letterSpacing: "0.01em" }}>
            İklimlendirme
          </span>
        </div>
      </Link>

      <ul className="grav-nav-links">
        <li>
          <Link to="/" preload="intent" preloadDelay={0}>
            Anasayfa
          </Link>
        </li>
        {HASH_LINKS.map((link) => (
          <li key={link.id}>
            <a href={`/#${link.id}`} onClick={(e) => onHashNav(e, link.id)}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="grav-nav-actions">
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
      </div>
    </nav>
  );
}

export default Navbar;
