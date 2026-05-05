import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GravityHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Pin hero for 2× viewport scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        pinSpacing: true,
      });

      if (motionOk) {
        // Video zooms out as user scrolls
        gsap.fromTo(
          videoRef.current,
          { scale: 1.15 },
          {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=200%",
              scrub: 1,
            },
          }
        );

        // VEGA letters stagger in from sides
        const letters = textRef.current?.querySelectorAll(".vega-letter");
        if (letters && letters.length) {
          gsap.fromTo(
            letters,
            {
              x: (_i: number) => (_i % 2 === 0 ? -120 : 120),
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=80%",
                scrub: 0.8,
              },
            }
          );
        }

        // Tagline fades up
        gsap.fromTo(
          ".hero-tagline",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "30% top",
              end: "+=60%",
              scrub: 0.6,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="gravity-hero">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="hero-video"
        src="/videos/vega_tanitim.mp4"
        aria-hidden="true"
      />

      {/* Dark overlay */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* VEGA wordmark + tagline */}
      <div ref={textRef} className="hero-text-center">
        <div className="vega-wordmark" aria-label="VEGA">
          {"VEGA".split("").map((l, i) => (
            <span key={i} className="vega-letter" aria-hidden="true">
              {l}
            </span>
          ))}
        </div>
        <p className="hero-tagline">Konforun Mühendisleri</p>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Kaydırın</span>
          <div className="scroll-line" />
        </div>
      </div>
    </div>
  );
}

export default GravityHero;
