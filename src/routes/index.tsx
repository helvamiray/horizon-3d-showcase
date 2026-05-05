import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Navbar }          from "@/components/Navbar";
import HeroVideo           from "@/components/HeroVideo";
import ProductFour         from "@/components/ProductFour";
import AboutAccordion      from "@/components/AboutAccordion";
import FlashlightOverlay   from "@/components/FlashlightOverlay";
import TurkeyMapPulse      from "@/components/TurkeyMapPulse";
import QuoteSimple         from "@/components/QuoteSimple";

import { initSmoothScroll, destroySmoothScroll } from "@/lib/smoothScroll";
import { initScrollReveal }                      from "@/lib/scrollReveal";
import "@/styles/gravity.css";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  component: Index,
});


function Index() {
  const thermalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initSmoothScroll();
    initScrollReveal();

    // HVAC thermal ambient: cool blue → warm amber as user scrolls product section
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOk && thermalRef.current) {
      const proxy = { progress: 0 };
      ScrollTrigger.create({
        trigger: "#urunler",
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1.5,
        onUpdate: (self) => {
          proxy.progress = self.progress;
          if (!thermalRef.current) return;
          // Interpolate: 0 = cold blue tint | 1 = warm amber tint
          const cold = { r: 219, g: 244, b: 255, a: 0.45 };
          const warm = { r: 255, g: 243, b: 219, a: 0.45 };
          const r = Math.round(cold.r + (warm.r - cold.r) * self.progress);
          const g = Math.round(cold.g + (warm.g - cold.g) * self.progress);
          const b = Math.round(cold.b + (warm.b - cold.b) * self.progress);
          thermalRef.current.style.background = `rgba(${r},${g},${b},${cold.a})`;
        },
      });
    }

    return () => {
      destroySmoothScroll();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "var(--font-premium-body, 'Inter', sans-serif)",
        background: "#ffffff",
        overflowX: "hidden",
      }}
    >
      {/* Cursor flashlight — sets CSS vars, no DOM overhead */}
      <FlashlightOverlay />

      {/* ── Transparent → solid Navbar ── */}
      <Navbar />

      {/* ── PHASE 1: Full-screen video hero ── */}
      <HeroVideo nextSectionId="urunler" />

      {/* ── PHASE 2: 4-card product grid + HVAC thermal ambient ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Thermal colour overlay — transitions cool→warm on scroll */}
        <div
          ref={thermalRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(219,244,255,0.45)",
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 80ms linear",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <ProductFour />
        </div>
      </div>

      {/* ── PHASE 3: About (accordion + live counters) ── */}
      <AboutAccordion />

      {/* ── PHASE 4: Turkey map — project locations ── */}
      <section
        id="projeler"
        style={{
          background: "#0a1628",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{ textAlign: "center", marginBottom: "2.5rem" }}
            data-reveal
          >
            <span
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                display: "block",
                marginBottom: "12px",
              }}
            >
              Türkiye Geneli
            </span>
            <h2
              style={{
                fontFamily: "var(--font-premium-display)",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                color: "white",
                letterSpacing: "-0.025em",
                margin: "0 0 0.75rem",
              }}
            >
              Referans Projelerimiz
            </h2>
            <p
              style={{
                fontFamily: "var(--font-premium-body)",
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.45)",
                margin: 0,
              }}
            >
              Şehirlerin üzerine gelerek projeyi inceleyin
            </p>
          </div>
          <TurkeyMapPulse />
        </div>
      </section>

      {/* ── PHASE 4: Contact form (z-index: 3000) ── */}
      <QuoteSimple />

      {/* ── Footer + Vega signature ── */}
      <footer
        style={{
          background: "#050d1a",
          padding: "3rem 1.5rem 2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* Footer top row — brand + links */}
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
              <p
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "white",
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
                  color: "rgba(255,255,255,0.35)",
                  margin: "0 0 14px",
                }}
              >
                Kurumsal ve Endüstriyel Çözümler
              </p>
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                Şişli, İstanbul
              </p>
            </div>

            {/* Quick links */}
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
                {[
                  { label: "Anasayfa",   href: "/" },
                  { label: "Hakkımızda", href: "/#hakkimizda" },
                  { label: "Ürünler",    href: "/#urunler" },
                  { label: "İletişim",   href: "/#iletisim" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: "var(--font-premium-body)",
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        transition: "color 180ms ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "white")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "2rem" }} />

          {/* Copyright */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-premium-mono)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.22)",
                margin: 0,
                letterSpacing: "0.08em",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Vega İklimlendirme — Şişli, İstanbul — Tüm hakları saklıdır
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
