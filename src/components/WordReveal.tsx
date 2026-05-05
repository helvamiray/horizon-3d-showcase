import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  text: string;
  /** Base text color (lit state). Default: inherit */
  litColor?: string;
  /** Dim color (unread state). Default: rgba(current, 0.18) */
  dimOpacity?: number;
  /** tag to render */
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  style?: React.CSSProperties;
  /** How much of the section to scrub over (0–1 of trigger height). Default: 0.8 */
  scrubRatio?: number;
}

/**
 * Splits `text` into word-spans and scrubs them from dim → lit
 * as the user scrolls through the element.  prefers-reduced-motion safe.
 */
const WordReveal = ({
  text,
  litColor,
  dimOpacity = 0.18,
  as: Tag = "p",
  className,
  style,
  scrubRatio = 0.85,
}: Props) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionOk = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Split text into word spans
    const words = text.trim().split(/\s+/);
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="wr-word" style="display:inline; white-space:pre-wrap;">${w} </span>`
      )
      .join("");

    if (!motionOk) return; // static full opacity for reduced-motion users

    const wordEls = el.querySelectorAll<HTMLSpanElement>(".wr-word");

    // Dim all words initially
    gsap.set(wordEls, { opacity: dimOpacity });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 78%",
        end: `bottom+=${el.offsetHeight * scrubRatio}px 30%`,
        scrub: 1.2,
      },
    });

    tl.to(wordEls, {
      opacity: 1,
      color: litColor,
      stagger: {
        each: 0.04,
        from: "start",
      },
      ease: "none",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter((t) => t.vars.trigger === el)
        .forEach((t) => t.kill());
      // Restore plain text so it's readable without JS
      el.textContent = text;
    };
  }, [text, dimOpacity, litColor, scrubRatio]);

  return (
    <Tag
      // @ts-expect-error — dynamic ref assignment
      ref={ref}
      className={className}
      style={style}
    />
  );
};

export default WordReveal;
