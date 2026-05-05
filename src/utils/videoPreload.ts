export function preloadVideo(src: string): void {
  if (!src || typeof document === "undefined") return;
  const existing = document.querySelector(`link[href="${src}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
}
