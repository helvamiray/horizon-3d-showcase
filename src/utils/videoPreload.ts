import { DESKTOP_VIDEO_MEDIA } from "@/constants/videoAssets";

export function preloadVideo(src: string): void {
  if (!src || typeof document === "undefined") return;
  if (typeof window !== "undefined" && !window.matchMedia(DESKTOP_VIDEO_MEDIA).matches) {
    return;
  }
  const existing = document.querySelector(`link[href="${src}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
}
