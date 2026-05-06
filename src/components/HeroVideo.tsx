import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  nextSectionId?: string;
}

const HeroVideo = ({ nextSectionId = "urunler" }: Props) => {
  const sectionRef   = useRef<HTMLElement>(null);
  const arrowRef     = useRef<HTMLButtonElement>(null);
  const vegaGhostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Arrow bob
      if (motionOk && arrowRef.current) {
        gsap.to(arrowRef.current, {
          y: 10, repeat: -1, yoyo: true, duration: 1.4, ease: "sine.inOut", delay: 0.8,
        });
      }

      // VEGA ghost parallax
      if (motionOk && vegaGhostRef.current && sectionRef.current) {
        gsap.to(vegaGhostRef.current, {
          y: "-40vh",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById(nextSectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
      aria-label="VEGA İklimlendirme Hero"
    >
      {/* Background video — full screen, no text */}
      <video
        autoPlay muted loop playsInline preload="auto"
        src="/videos/vega_tanitim.mp4"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Very light bottom gradient so next section has a clean entry */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(to bottom, transparent, rgba(2,6,8,0.9))",
          pointerEvents: "none",
        }}
      />

      {/* Ghost VEGA parallax watermark */}
      <div
        ref={vegaGhostRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-premium-display)",
          fontSize: "clamp(140px, 24vw, 360px)",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1px rgba(0,240,255,0.07)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}
      >
        VEGA
      </div>

      {/* Tagline — bottom-left overlay, subtle but legible */}
      <div
        style={{
          position: "absolute",
          bottom: "4.5rem",
          left: "clamp(24px, 5vw, 80px)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-premium-mono)",
            fontSize: "clamp(9px, 1vw, 11px)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--electric-cyan, #00f0ff)",
            opacity: 0.7,
          }}
        >
          // VEGA İKLİMLENDİRME
        </span>
        <span
          style={{
            fontFamily: "var(--font-premium-display)",
            fontSize: "clamp(18px, 2.4vw, 30px)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            textShadow: "0 2px 20px rgba(0,0,0,0.7)",
          }}
        >
          Endüstriyel ve Kurumsal Çözümler
        </span>
      </div>

      {/* Scroll arrow */}
      <button
        ref={arrowRef}
        onClick={scrollToNext}
        aria-label="Aşağı kaydır"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          background: "rgba(0,240,255,0.07)",
          border: "1px solid rgba(0,240,255,0.2)",
          borderRadius: "4px",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(0,240,255,0.7)",
          cursor: "pointer",
          transition: "background 200ms ease, box-shadow 200ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,240,255,0.16)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 18px rgba(0,240,255,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,240,255,0.07)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        <ChevronDown size={20} />
      </button>
    </section>
  );
};

export default HeroVideo;
