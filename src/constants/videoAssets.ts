import { MEDIA_MIN_DESKTOP } from "@/constants/layoutBreakpoint";

/** Viewport where full video preload / hover preload applies (Tailwind `lg`). */
export const DESKTOP_VIDEO_MEDIA = MEDIA_MIN_DESKTOP;

export const HERO_VEGA_VIDEO = {
  webm: "/videos/vega_tanitim.webm",
  mp4: "/videos/vega_tanitim.mp4",
  poster: "/img/posters/vega-hero.webp",
} as const;

export const ABOUT_CIRCLE_VIDEO = {
  mp4: "/videos/tanitim.mp4",
  poster: "/img/posters/tanitim-about.webp",
} as const;
