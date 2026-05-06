import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Navbar }           from "@/components/Navbar";
import HeroVideo            from "@/components/HeroVideo";
import ProductSlider        from "@/components/ProductSlider";
import ProductEngine        from "@/components/ProductEngine";
import AnimatedStats        from "@/components/AnimatedStats";
import MissionVision        from "@/components/MissionVision";
import SolutionPartners     from "@/components/SolutionPartners";
import IndustrialShowcase   from "@/components/IndustrialShowcase";
import FlashlightOverlay    from "@/components/FlashlightOverlay";
import TurkeyMapSimple      from "@/components/TurkeyMapSimple";
import QuoteSimple          from "@/components/QuoteSimple";

import { initSmoothScroll, destroySmoothScroll } from "@/lib/smoothScroll";
import { initScrollReveal }                      from "@/lib/scrollReveal";
import "@/styles/gravity.css";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    initSmoothScroll();
    initScrollReveal();

    return () => {
      destroySmoothScroll();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "var(--font-premium-body, 'Inter', sans-serif)",
        background: "var(--terminal-bg, #020608)",
        overflowX: "hidden",
      }}
    >
      <FlashlightOverlay />
      <Navbar />

      {/* 01 · Full-screen video hero */}
      <HeroVideo nextSectionId="urunler" />

      {/* 02 · Animated stats bar */}
      <AnimatedStats />

      {/* 03 · Infinite product slider with modal */}
      <ProductSlider />

      {/* 04 · Product catalogue — search + filter grid */}
      <ProductEngine />

      {/* 05 · About — Mission & Vision with Framer Motion reading effect */}
      <MissionVision />

      {/* 06 · Industrial & Corporate showcase headlines */}
      <IndustrialShowcase />

      {/* 07 · Solution partners */}
      <SolutionPartners />

      {/* 07 · Project map */}
      <section
        id="projeler"
        style={{
          background: "var(--terminal-surface2, #0d1520)",
          padding: "clamp(60px,10vw,100px) clamp(20px,6vw,80px)",
          borderTop:    "1px solid var(--terminal-border, rgba(0,240,255,0.1))",
          borderBottom: "1px solid var(--terminal-border, rgba(0,240,255,0.1))",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{
              fontFamily: "var(--font-premium-mono)", fontSize: "11px",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "var(--electric-cyan, #00f0ff)", margin: "0 0 0.75rem",
            }}>
              // 03.PROJECTS
            </p>
            <h2 style={{
              fontFamily: "var(--font-premium-display)", fontWeight: 800,
              fontSize: "clamp(1.5rem,3vw,2.25rem)", color: "white",
              letterSpacing: "-0.025em", margin: "0 0 0.5rem",
            }}>
              Referans Projelerimiz
            </h2>
            <p style={{
              fontFamily: "var(--font-premium-mono)", fontSize: "11px",
              color: "rgba(255,255,255,0.35)", margin: 0, letterSpacing: "0.1em",
            }}>
              Türkiye genelinde tamamlanan projeler
            </p>
          </div>
          <TurkeyMapSimple />
        </div>
      </section>

      {/* 08 · Contact form */}
      <QuoteSimple />

      {/* 07 · Footer */}
      <footer
        style={{
          background: "var(--terminal-bg, #020608)",
          padding: "3rem 1.5rem 2rem",
          borderTop: "1px solid var(--terminal-border, rgba(0,240,255,0.12))",
        }}
      >
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
            {/* Brand */}
            <div>
              <p style={{
                fontFamily: "var(--font-premium-display)", fontWeight: 800,
                fontSize: "1.25rem", color: "white",
                margin: "0 0 6px", letterSpacing: "-0.01em",
              }}>
                Vega İklimlendirme
              </p>
              <p style={{
                fontFamily: "var(--font-premium-mono)", fontSize: "11px",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--electric-cyan, #00f0ff)", opacity: 0.55,
                margin: "0 0 14px",
              }}>
                Kurumsal ve Endüstriyel Çözümler
              </p>
              <p style={{
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.875rem", color: "rgba(255,255,255,0.35)", margin: 0,
              }}>
                Şişli, İstanbul
              </p>
            </div>

            {/* Quick links */}
            <nav aria-label="Footer navigasyon">
              <ul style={{
                listStyle: "none", margin: 0, padding: 0,
                display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end",
              }}>
                {[
                  { label: "Anasayfa",   href: "/" },
                  { label: "Hakkımızda", href: "/#hakkimizda" },
                  { label: "Ürünler",    href: "/#urunler" },
                  { label: "İletişim",   href: "/#iletisim" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith("/#")) {
                          e.preventDefault();
                          document.getElementById(link.href.slice(2))?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      style={{
                        fontFamily: "var(--font-premium-mono)", fontSize: "11px",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "rgba(255,255,255,0.35)", textDecoration: "none",
                        transition: "color 180ms ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--electric-cyan,#00f0ff)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.35)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div style={{
            height: "1px",
            background: "linear-gradient(90deg,transparent,var(--terminal-border,rgba(0,240,255,0.12)) 50%,transparent)",
            marginBottom: "2.5rem",
          }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{
              fontFamily: "var(--font-premium-mono)", fontSize: "10px",
              color: "rgba(255,255,255,0.18)", margin: 0,
              letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center",
            }}>
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
    </div>
  );
}
