export const CATEGORY_VIDEO_MAP: Record<string, string> = {
  klima: "/videos/klima.mp4",
  fancoil: "/videos/klima.mp4",
  sogutma: "/videos/klima.mp4",
  "isi-pompasi": "/videos/isi-pompasi.mp4",
  "isi pompasi": "/videos/isi-pompasi.mp4",
  heatpump: "/videos/isi-pompasi.mp4",
  kazan: "/videos/kazan.mp4",
  kombi: "/videos/kazan.mp4",
  boru: "/videos/kazan.mp4",
  tank: "/videos/kazan.mp4",
  hidrofor: "/videos/kazan.mp4",
  radyator: "/videos/kazan.mp4",
  yangin: "/videos/yangin.mp4",
  "yangin sistemleri": "/videos/yangin.mp4",
};

export const CATEGORY_POSTER_MAP: Record<string, string> = {
  klima: "/images/posters/klima.jpg",
  kazan: "/images/posters/kazan.jpg",
  yangin: "/images/posters/yangin.jpg",
  "isi-pompasi": "/images/posters/isi-pompasi.jpg",
};

const NORMALIZE_MAP: Record<string, string> = {
  ı: "i",
  ş: "s",
  ğ: "g",
  ü: "u",
  ö: "o",
  ç: "c",
  İ: "i",
  Ş: "s",
  Ğ: "g",
  Ü: "u",
  Ö: "o",
  Ç: "c",
};

function normalizeCategory(raw: string): string {
  return raw
    .toLowerCase()
    .split("")
    .map((c) => NORMALIZE_MAP[c] ?? c)
    .join("")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getVideoForProduct(category: string): string {
  const key = normalizeCategory(category);
  return CATEGORY_VIDEO_MAP[key] ?? CATEGORY_VIDEO_MAP[category.toLowerCase()] ?? "/videos/klima.mp4";
}

export function getPosterForProduct(category: string): string {
  const key = normalizeCategory(category);
  return CATEGORY_POSTER_MAP[key] ?? CATEGORY_POSTER_MAP[category.toLowerCase()] ?? "";
}
