import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VegaSignature = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!motionOk) return;

    const ctx = gsap.context(() => {
      gsap.to(".signature-path", {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="vega-signature-wrapper" aria-hidden="true">
      <svg
        viewBox="0 0 400 120"
        className="signature-svg"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Vega imzası"
      >
        <path
          d="M 20,80 C 40,20 60,20 80,60 C 100,100 120,100 140,60
             M 160,30 C 160,30 150,90 180,90 C 210,90 200,30 230,30
             M 250,30 L 250,90 C 250,90 290,90 290,60 C 290,30 250,30 250,30
             M 310,30 C 310,30 300,60 320,75 C 340,90 360,60 360,30"
          className="signature-path"
          fill="none"
          stroke="var(--gold, #c9a84c)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="signature-label">
        Vega Enerji · Konforun Mühendisleri · Est. 2006
      </p>
    </div>
  );
};

export default VegaSignature;
