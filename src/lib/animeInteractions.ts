/**
 * Anime.js v4 spring micro-interactions.
 * Call initAnimeInteractions() once after DOM is ready.
 */
import { animate, spring } from "animejs";

function addSpringHover(selector: string) {
  const els = document.querySelectorAll<HTMLElement>(selector);
  els.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      animate(el, {
        scale: 1.055,
        duration: 320,
        ease: spring({ stiffness: 380, damping: 20 }),
      });
    });
    el.addEventListener("mouseleave", () => {
      animate(el, {
        scale: 1,
        duration: 400,
        ease: spring({ stiffness: 320, damping: 26 }),
      });
    });
    el.addEventListener("mousedown", () => {
      animate(el, {
        scale: 0.93,
        duration: 130,
        ease: spring({ stiffness: 600, damping: 22 }),
      });
    });
    el.addEventListener("mouseup", () => {
      animate(el, {
        scale: 1.03,
        duration: 260,
        ease: spring({ stiffness: 380, damping: 20 }),
      });
    });
  });
}

/** Apply spring bounce to emoji category buttons */
function springEmojis() {
  document.querySelectorAll<HTMLElement>(".swap-pill").forEach((el) => {
    el.addEventListener("click", () => {
      animate(el, {
        scale: [1, 0.84, 1.12, 1],
        duration: 480,
        ease: spring({ stiffness: 450, damping: 14 }),
      });
    });
  });
}

/** Pulsing glow on "Sepete Ekle" button */
function pulseAddBtn() {
  document.querySelectorAll<HTMLElement>(".swap-btn-add").forEach((el) => {
    animate(el, {
      boxShadow: [
        "0 0 0px rgba(0,212,255,0)",
        "0 0 18px rgba(0,212,255,0.35)",
        "0 0 0px rgba(0,212,255,0)",
      ],
      loop: true,
      duration: 2200,
      ease: "inOut(2)",
    });
  });
}

/** Path draw animation for SVG decorations */
function drawSVGPaths() {
  const paths = document.querySelectorAll<SVGPathElement>("[data-anime-draw]");
  paths.forEach((path) => {
    const length = path.getTotalLength?.() ?? 600;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    animate(path, {
      strokeDashoffset: [length, 0],
      duration: 1400,
      ease: "inOut(3)",
    });
  });
}

export function initAnimeInteractions(): void {
  const motionOk = !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (!motionOk) return;

  // Slight delay so DOM is fully rendered
  setTimeout(() => {
    addSpringHover(".grav-nav-cta");
    addSpringHover(".twin-open-btn");
    addSpringHover(".btn-submit-magnetic");
    springEmojis();
    pulseAddBtn();
    drawSVGPaths();
  }, 400);
}
