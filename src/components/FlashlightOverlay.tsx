import { useEffect } from "react";

/**
 * FlashlightOverlay
 *
 * Sets two CSS custom properties on <html> — --glow-x and --glow-y —
 * that track the cursor. A fixed ::before pseudo-element (added via
 * gravity.css) uses these to render a radial glow that follows the mouse.
 *
 * Renders no DOM node of its own; the visual lives entirely in CSS so
 * it never interrupts pointer events or layout.
 */
const FlashlightOverlay = () => {
  useEffect(() => {
    const root = document.documentElement;

    // Set defaults so the glow starts centered
    root.style.setProperty("--glow-x", "50vw");
    root.style.setProperty("--glow-y", "50vh");

    const onMove = (e: MouseEvent) => {
      root.style.setProperty("--glow-x", `${e.clientX}px`);
      root.style.setProperty("--glow-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
};

export default FlashlightOverlay;
