import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { animate, spring } from "animejs";
import { ArrowLeft, ShoppingCart, X, ArrowRight, Phone, Mail } from "lucide-react";

import { getProductById } from "@/lib/productService";
import { useCart } from "@/providers/CartContext";
import {
  getVideoForProduct,
  getPosterForProduct,
} from "@/constants/productVideos";
import { VEGA_CONTACTS } from "@/utils/contacts";
import "@/styles/product-detail.css";

export const Route = createFileRoute("/urunler/$slug")({
  component: ProductDetailPage,
});

// ── Quote modal — white glassmorphism + Anime.js spring ──────────────────────
interface QuoteModalProps {
  productName: string;
  onClose: () => void;
}

function QuoteModal({ productName, onClose }: QuoteModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);

  // Anime.js spring scale-in on mount
  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) return;

    // Fade overlay
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });

    // Spring panel
    if (panelRef.current) {
      gsap.set(panelRef.current, { opacity: 0 });
      animate(panelRef.current, {
        scale:   [0.84, 1],
        opacity: [0, 1],
        duration: 520,
        ease: spring({ stiffness: 320, damping: 22, velocity: 2 }),
      });
    }
  }, []);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleClose = () => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!motionOk) { onClose(); return; }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current,   { scale: 0.9, opacity: 0, duration: 0.22, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "power2.in" }, "-=0.08");
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    const subject = encodeURIComponent(`Teklif Talebi: ${productName} — ${name}`);
    const body = encodeURIComponent(
      `Ürün: ${productName}\nAd Soyad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`
    );
    window.location.href = `mailto:${VEGA_CONTACTS.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const ready = name.trim() && email.trim();

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && handleClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,22,40,0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Teklif Al"
    >
      <div
        ref={panelRef}
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: "24px",
          padding: "2.75rem",
          width: "min(500px, 100%)",
          position: "relative",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.07), 0 24px 60px -8px rgba(10,22,40,0.22), 0 0 0 1px rgba(201,168,76,0.15)",
          willChange: "transform, opacity",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Kapat"
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "rgba(10,22,40,0.06)",
            border: "1px solid rgba(10,22,40,0.1)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
            cursor: "pointer",
            transition: "background 180ms ease, color 180ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#0a1628";
            (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(10,22,40,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color = "#475569";
          }}
        >
          <X size={15} />
        </button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <span style={{ fontSize: "2.75rem", display: "block", marginBottom: "14px" }}>✅</span>
            <h3
              style={{
                fontFamily: "var(--font-premium-display)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#0a1628",
                margin: "0 0 8px",
              }}
            >
              Talebiniz iletildi
            </h3>
            <p
              style={{
                fontFamily: "var(--font-premium-body)",
                color: "#64748b",
                margin: 0,
                fontSize: "0.9375rem",
                lineHeight: 1.6,
              }}
            >
              En kısa sürede sizinle iletişime geçeceğiz.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "3px",
                  background: "var(--gold, #c9a84c)",
                  borderRadius: "2px",
                  marginBottom: "14px",
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "#0a1628",
                  margin: "0 0 6px",
                  letterSpacing: "-0.02em",
                }}
              >
                Teklif Al
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-premium-body)",
                  fontSize: "0.875rem",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {productName}
              </p>
            </div>

            {/* Contact chips */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
              }}
            >
              <a
                href={`tel:${VEGA_CONTACTS.phone}`}
                style={contactChipStyle}
              >
                <Phone size={12} />
                {VEGA_CONTACTS.phone}
              </a>
              <a
                href={`mailto:${VEGA_CONTACTS.email}`}
                style={contactChipStyle}
              >
                <Mail size={12} />
                {VEGA_CONTACTS.email}
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="Ad Soyad *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                aria-label="Ad Soyad"
                style={lightInputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--gold, #c9a84c)")}
                onBlur={(e)  => ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(10,22,40,0.15)")}
              />
              <input
                type="email"
                placeholder="E-posta *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="E-posta"
                style={lightInputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "var(--gold, #c9a84c)")}
                onBlur={(e)  => ((e.currentTarget as HTMLInputElement).style.borderColor = "rgba(10,22,40,0.15)")}
              />
              <textarea
                placeholder="Mesajınız (isteğe bağlı)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                aria-label="Mesajınız"
                style={{
                  ...lightInputStyle,
                  resize: "vertical",
                  minHeight: "82px",
                } as React.CSSProperties}
                onFocus={(e) => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = "var(--gold, #c9a84c)")}
                onBlur={(e)  => ((e.currentTarget as HTMLTextAreaElement).style.borderColor = "rgba(10,22,40,0.15)")}
              />

              <button
                onClick={handleSubmit}
                disabled={!ready}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: ready ? "var(--navy-primary, #0a1628)" : "#e2e8f0",
                  color: ready ? "white" : "#94a3b8",
                  border: "none",
                  padding: "14px 24px",
                  borderRadius: "100px",
                  fontFamily: "var(--font-premium-display)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: ready ? "pointer" : "not-allowed",
                  transition: "background 220ms ease, box-shadow 220ms ease",
                  marginTop: "4px",
                }}
                onMouseEnter={(e) => {
                  if (ready) {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--gold, #c9a84c)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(201,168,76,0.38)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (ready) {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--navy-primary, #0a1628)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }
                }}
              >
                Teklif Gönder
                <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const lightInputStyle: React.CSSProperties = {
  background: "rgba(10,22,40,0.03)",
  border: "1.5px solid rgba(10,22,40,0.15)",
  borderRadius: "10px",
  padding: "12px 16px",
  fontSize: "14px",
  fontFamily: "var(--font-premium-body)",
  color: "#0a1628",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 200ms ease",
};

const contactChipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "5px 12px",
  background: "rgba(10,22,40,0.05)",
  border: "1px solid rgba(10,22,40,0.1)",
  borderRadius: "100px",
  fontFamily: "var(--font-premium-mono)",
  fontSize: "11px",
  color: "#475569",
  textDecoration: "none",
  transition: "background 180ms ease, color 180ms ease",
};

// ── Product detail page ──────────────────────────────────────────────────────
function ProductDetailPage() {
  const { slug }    = Route.useParams();
  const navigate    = useNavigate();
  const panelRef    = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  const [quoteOpen, setQuoteOpen]   = useState(false);
  const [toastMsg,  setToastMsg]    = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const product   = getProductById(slug);
  const videoSrc  = getVideoForProduct(product?.category ?? slug);
  const posterSrc = getPosterForProduct(product?.category ?? slug);

  // Entrance animation for the glass panel
  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!motionOk) return;
      gsap.fromTo(
        panelRef.current!.querySelectorAll<HTMLElement>("[data-animate]"),
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [slug]);

  // Prevent body scroll when quote modal is open
  useEffect(() => {
    document.body.style.overflow = quoteOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [quoteOpen]);

  // Silent add-to-cart — no cart panel, just a toast
  const handleAddToCart = () => {
    if (!product) return;
    add(product);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(`✓  ${product.name} sepete eklendi`);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  };

  if (!product) return <ProductNotFound slug={slug} />;

  return (
    <>
      <div className="product-detail-page">
        {/* Background video */}
        <div className="video-background">
          <video
            autoPlay muted loop playsInline preload="metadata"
            poster={posterSrc}
            className="bg-video"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="video-overlay" />
        </div>

        {/* Back button */}
        <button className="back-button" onClick={() => navigate({ to: "/" })} aria-label="Kataloğa Dön">
          <ArrowLeft size={16} />
          <span>Kataloğa Dön</span>
        </button>

        {/* Glass panel */}
        <div className="glass-panel-wrapper">
          <div ref={panelRef} className="product-glass-panel">
            <div className="panel-header" data-animate>
              <span className="brand-badge">{product.brand}</span>
              <span className="category-badge">{product.category}</span>
            </div>

            <h1 className="product-page-title" data-animate>{product.name}</h1>
            <p className="product-page-description" data-animate>{product.description}</p>

            {product.specs.length > 0 && (
              <div className="specs-grid" data-animate>
                {product.specs.slice(0, 4).map((spec, i) => {
                  const [key, ...rest] = spec.split(":");
                  const value = rest.length ? rest.join(":").trim() : spec;
                  const label = rest.length ? key.trim() : `Özellik ${i + 1}`;
                  return (
                    <div key={i} className="spec-item">
                      <span className="spec-key">{label}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="panel-divider" data-animate />

            <div className="price-row" data-animate>
              {product.price && product.price !== "-" ? (
                <span className="price-large">{product.price}</span>
              ) : (
                <span className="price-quote-label">Fiyat için teklif alın</span>
              )}
            </div>

            <div className="cta-row" data-animate>
              <button className="btn-add-cart" onClick={handleAddToCart}>
                <ShoppingCart size={16} />
                <span>Sepete Ekle</span>
              </button>
              <button
                className="btn-quote-outline"
                onClick={() => setQuoteOpen(true)}
                aria-haspopup="dialog"
              >
                Teklif Al
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote modal — rendered OUTSIDE the page stack so z-index is clean */}
      {quoteOpen && (
        <QuoteModal
          productName={product.name}
          onClose={() => setQuoteOpen(false)}
        />
      )}

      {/* Silent cart toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,22,40,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            color: "white",
            padding: "12px 22px",
            borderRadius: "100px",
            fontFamily: "var(--font-premium-display)",
            fontWeight: 600,
            fontSize: "0.875rem",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            border: "1px solid rgba(201,168,76,0.3)",
            animation: "toast-in 280ms cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {toastMsg}
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.94); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

function ProductNotFound({ slug }: { slug: string }) {
  const navigate = useNavigate();
  return (
    <div className="not-found-page">
      <p>Ürün bulunamadı: {slug}</p>
      <button onClick={() => navigate({ to: "/" })}>Ana Sayfaya Dön</button>
    </div>
  );
}
