import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/CartContext";

const NAV_LINKS = [
  { label: "Anasayfa",   href: "/"            },
  { label: "Hakkımızda", href: "/#hakkimizda" },
  { label: "Ürünler",    href: "/#urunler"    },
  { label: "İletişim",   href: "/#iletisim"   },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`grav-navbar${scrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label="Ana navigasyon"
    >
      {/* Logo */}
      <Link to="/" className="grav-nav-logo" aria-label="Vega İklimlendirme Ana Sayfa">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <polygon
            points="16,3 29,27 3,27"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <polygon
            points="16,11 23,24 9,24"
            fill="currentColor"
            opacity="0.35"
          />
        </svg>
        <div className="grav-nav-wordmark">
          <span className="grav-nav-brand" style={{ fontFamily: "var(--font-premium-display)", fontWeight: 700, letterSpacing: "-0.01em" }}>Vega</span>
          <span className="grav-nav-sub" style={{ fontFamily: "var(--font-premium-display)", letterSpacing: "0.01em" }}>İklimlendirme</span>
        </div>
      </Link>

      {/* Center links */}
      <ul className="grav-nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="grav-nav-actions">
        <button
          className="grav-nav-cart"
          onClick={openCart}
          aria-label={`Sepet — ${count} ürün`}
        >
          <ShoppingCart size={18} />
          {count > 0 && (
            <span className="grav-cart-badge" aria-hidden="true">
              {count}
            </span>
          )}
        </button>
        <button
          className="grav-nav-cta"
          onClick={() => {
            const el = document.getElementById("iletisim");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          aria-label="Teklif Al — İletişim bölümüne git"
        >
          Teklif Al
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
