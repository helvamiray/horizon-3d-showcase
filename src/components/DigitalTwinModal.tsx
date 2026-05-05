import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { X, Maximize2 } from "lucide-react";
import Mini3DPreview from "@/components/Mini3DPreview";

// Villa3D is loaded lazily — zero cost until user clicks
const Villa3DLazy = lazy(() => import("@/components/Villa3D"));

const DigitalTwinModal = () => {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!open || !overlayRef.current || !panelRef.current) return;

    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (motionOk) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.fromTo(
        panelRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [open]);

  const closeModal = () => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (motionOk && overlayRef.current && panelRef.current) {
      gsap.to(panelRef.current, {
        scale: 0.92,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => setOpen(false),
      });
    } else {
      setOpen(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── CTA SECTION ── */}
      <section className="twin-cta-section" id="dijital-ikiz" data-reveal>
        <div className="twin-cta-inner">
          {/* Left: thumbnail preview */}
          <div className="twin-thumb-wrap" aria-hidden="true">
            <div className="twin-thumb-canvas">
              <Mini3DPreview kind="heatpump" spinning />
            </div>
            {/* Play overlay */}
            <div className="twin-thumb-overlay">
              <div className="twin-play-btn" aria-hidden="true">
                <Maximize2 size={22} />
              </div>
            </div>
          </div>

          {/* Right: text + CTA */}
          <div className="twin-cta-text">
            <span className="twin-eyebrow">● DİJİTAL İKİZ · 3D İNTERAKTİF</span>
            <h2 className="twin-cta-headline">
              Vega Dijital İkiz<br />
              <span style={{ color: "var(--vega-cyan)" }}>Deneyimi</span>
            </h2>
            <p className="twin-cta-body">
              Sistemlerimizin bir villa içerisindeki gerçek kurulumunu
              interaktif olarak keşfedin. Isı pompasından yangın sistemine,
              her bileşeni 3D ortamda inceleyin.
            </p>
            <button
              className="twin-open-btn"
              onClick={openModal}
              aria-label="3D Villa Deneyimini Başlat"
            >
              3D Villa Deneyimini Başlat
              <span className="twin-btn-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── MODAL OVERLAY ── */}
      {open && (
        <div
          ref={overlayRef}
          className="twin-modal-overlay"
          onClick={(e) => e.target === overlayRef.current && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-label="3D Villa Deneyimi"
        >
          <div ref={panelRef} className="twin-modal-panel">
            {/* Close button */}
            <button
              className="twin-modal-close"
              onClick={closeModal}
              aria-label="Kapat"
            >
              <X size={20} />
            </button>

            {/* Lazy 3D scene */}
            <Suspense
              fallback={
                <div className="twin-modal-loading">
                  <div className="twin-loading-spinner" aria-hidden="true" />
                  <span>3D sahne yükleniyor…</span>
                </div>
              }
            >
              <Villa3DLazy highlightedKey={null} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
};

export default DigitalTwinModal;
