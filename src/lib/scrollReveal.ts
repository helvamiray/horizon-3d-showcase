import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveal(): void {
  const motionOk = !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!motionOk) return;

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>("[data-reveal-children]").forEach((el) => {
    gsap.from(Array.from(el.children), {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        once: true,
      },
    });
  });

  gsap.utils.toArray<HTMLElement>(".section-headline").forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        once: true,
      },
    });
  });
}
