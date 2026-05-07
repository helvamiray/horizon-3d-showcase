import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { HERO_VEGA_VIDEO } from "@/constants/videoAssets";
import { prefersSmoothHashScroll } from "@/utils/navigateToHashSection";
import { useIsNarrowViewport } from "@/hooks/useIsNarrowViewport";

interface Props {
  nextSectionId?: string;
}

const HeroVideo = ({ nextSectionId = "urunler" }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);
  const narrow = useIsNarrowViewport();

  const scrollToNext = () => {
    const smooth = prefersSmoothHashScroll();
    const el = document.getElementById(nextSectionId);
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    else window.scrollBy({ top: window.innerHeight, behavior: smooth ? "smooth" : "auto" });
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
      <video
        autoPlay
        muted
        loop
        playsInline
        preload={narrow ? "none" : "metadata"}
        poster={HERO_VEGA_VIDEO.poster}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      >
        <source src={HERO_VEGA_VIDEO.webm} type="video/webm" />
        <source src={HERO_VEGA_VIDEO.mp4} type="video/mp4" />
      </video>

      {/* Top gradient — keeps navbar links readable over bright footage */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "min(38vh, 320px)",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 52%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Light bottom fade into next section */}
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
          zIndex: 2,
        }}
      />

      <div className="hero-scroll-cta-shell">
        <div className="hero-scroll-cta-bounce">
          <button
            type="button"
            className="hero-scroll-cta"
            onClick={scrollToNext}
            aria-label="Aşağı kaydır — sonraki bölüme git"
          >
            <ChevronDown
              className="hero-scroll-cta__icon"
              size={24}
              strokeWidth={1.5}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
