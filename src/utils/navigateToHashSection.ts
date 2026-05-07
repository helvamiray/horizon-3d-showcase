import type { NavigateFn } from "@tanstack/react-router";
import { MEDIA_MAX_NARROW } from "@/constants/layoutBreakpoint";

/**
 * Desktop (lg+): allow smooth in-page / hash scrolling.
 * Dar / orta viewport: anında atlama — uzun sayfada `smooth` çok uzun sürebilir.
 */
export function prefersSmoothHashScroll(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia(MEDIA_MAX_NARROW).matches) return false;
  return true;
}

/** Options for `scrollIntoView` and TanStack Router `hashScrollIntoView`. */
export function hashScrollIntoViewOptions(): {
  behavior: ScrollBehavior;
  block: "start";
} {
  return {
    behavior: prefersSmoothHashScroll() ? "smooth" : "auto",
    block: "start",
  };
}

/** Scroll to `#id` on the current page, or navigate to `/#id` on the home page if the element is missing. */
export function navigateToHashSection(navigate: NavigateFn, hashId: string) {
  const el = document.getElementById(hashId);
  const scrollOpts = hashScrollIntoViewOptions();
  if (el) {
    el.scrollIntoView(scrollOpts);
    return;
  }
  navigate({
    to: "/",
    hash: hashId,
    resetScroll: false,
    hashScrollIntoView: scrollOpts,
  });
}
