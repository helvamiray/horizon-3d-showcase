import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

interface Props {
  /** ID of the next section to scroll to */
  nextSectionId?: string;
}

const HeroVideo = ({ nextSectionId = "urunler" }: Props) => {
  const textRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (motionOk && textRef.current) {
        gsap.fromTo(
          textRef.current.querySelectorAll("[data-hero-anim]"),
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.4,
          }
        );
      }

      // Arrow bob animation
      if (motionOk && arrowRef.current) {
        gsap.to(arrowRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: "sine.inOut",
          delay: 1.5,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById(nextSectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
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
      aria-label="VEGA Enerji Hero"
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/videos/vega_tanitim.mp4"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(5,13,26,0.45) 0%, rgba(5,13,26,0.62) 60%, rgba(5,13,26,0.88) 100%)",
        }}
      />

      {/* Text content — brand felt through design, not large text */}
      <div
        ref={textRef}
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          className: "hero-text-float",
        } as React.CSSProperties}
        className="hero-text-float"
      >
        {/* Small brand moniker */}
        <span
          data-hero-anim
          style={{
            fontFamily: "var(--font-premium-mono, 'JetBrains Mono', monospace)",
            fontSize: "clamp(9px, 1.1vw, 12px)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.38)",
            display: "block",
          }}
        >
          Vega İklimlendirme · Est. 2012
        </span>

        {/* Primary tagline — the headline */}
        <h1
          data-hero-anim
          style={{
            fontFamily: "var(--font-premium-display, 'Poppins', sans-serif)",
            fontSize: "clamp(32px, 5.5vw, 80px)",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          Geleceğin İklimlendirme
          <br />
          <span style={{ color: "var(--gold, #c9a84c)" }}>Teknolojileri</span>
        </h1>

        {/* Product categories */}
        <p
          data-hero-anim
          style={{
            fontFamily: "var(--font-premium-body, 'Inter', sans-serif)",
            fontSize: "clamp(13px, 1.5vw, 17px)",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Isı Pompası · Klima · Kazan · Yangın Sistemleri
        </p>

        {/* CTA strip */}
        <div data-hero-anim style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => document.getElementById("urunler")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "var(--gold, #c9a84c)",
              color: "var(--navy-primary, #0a1628)",
              border: "none",
              padding: "12px 28px",
              borderRadius: "100px",
              fontFamily: "var(--font-premium-display)",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Ürünleri Keşfet
          </button>
          <button
            onClick={() => document.getElementById("iletisim")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "12px 28px",
              borderRadius: "100px",
              fontFamily: "var(--font-premium-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Teklif Al
          </button>
        </div>
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
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          cursor: "pointer",
          transition: "background 200ms ease",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.18)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.10)")
        }
      >
        <ChevronDown size={22} />
      </button>
    </section>
  );
};

export default HeroVideo;
