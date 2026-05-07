import { Link, useNavigate } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { navigateToHashSection } from "@/utils/navigateToHashSection";

const FOOTER_LINKS: { label: string; to?: string; hash?: string }[] = [
  { label: "Anasayfa", to: "/" },
  { label: "Hakkımızda", hash: "hakkimizda" },
  { label: "Ürünler", hash: "urunler" },
  { label: "İletişim", hash: "iletisim" },
];

export function SiteFooter() {
  const navigate = useNavigate();

  const onHashClick = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    navigateToHashSection(navigate, hash);
  };

  return (
    <>
      <footer className="site-footer">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "start",
              marginBottom: "2.5rem",
            }}
            className="footer-grid"
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--text-on-terminal-strong)",
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}
              >
                Vega İklimlendirme
              </p>
              <p
                style={{
                  fontFamily: "var(--font-premium-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--electric-cyan, #00f0ff)",
                  opacity: 0.55,
                  margin: "0 0 14px",
                }}
              >
                Kurumsal ve Endüstriyel Çözümler
              </p>
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  fontSize: "0.875rem",
                  color: "var(--text-on-terminal-soft)",
                  margin: 0,
                }}
              >
                Şişli, İstanbul
              </p>
            </div>

            <nav aria-label="Footer navigasyon">
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "flex-end",
                }}
              >
                {FOOTER_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        style={{
                          fontFamily: "var(--font-premium-mono)",
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--footer-link)",
                          textDecoration: "none",
                          transition: "color 180ms ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--footer-link-hover)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--footer-link)";
                        }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={`/#${link.hash}`}
                        onClick={(e) => link.hash && onHashClick(e, link.hash)}
                        style={{
                          fontFamily: "var(--font-premium-mono)",
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--footer-link)",
                          textDecoration: "none",
                          transition: "color 180ms ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--footer-link-hover)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = "var(--footer-link)";
                        }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg,transparent,var(--terminal-border,rgba(0,240,255,0.12)) 50%,transparent)",
              marginBottom: "2.5rem",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "10px",
                color: "var(--footer-copy)",
                margin: 0,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Vega İklimlendirme · Şişli, İstanbul · Tüm hakları saklıdır
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-grid nav ul { align-items: flex-start !important; }
        }
      `}</style>
    </>
  );
}
