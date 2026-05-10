/**
 * Brand keys for showroom ↔ catalog filtering (`ProductEngine` consumes `brandKey`).
 * MARKALAR tahtası — sabit ızgarada Cloudinary logoları (BrandBoardInteractive).
 */

/** `window` üzerinde marka seçimi — `detail`: marka etiketi (`brand.label`). */
export const SHOWROOM_BRAND_SELECT_EVENT = "showroom-brand-select";

/** Full-viewport hero / showroom backdrop (cover). Replace URL to swap artwork. */
export const SHOWROOM_HERO_IMAGE_URL =
  "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778317735/ChatGPT_Image_9_May_2026_12_08_38_jaitb7.png";

/** Official-style accent for MARKALAR hover glow (hex #RRGGBB). */
export const SHOWROOM_BRAND_NODES = [
  {
    key: "Daikin",
    label: "Daikin",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778328949/daikin_turkey_logo_q1jepz.jpg",
    accentColor: "#00A8E1",
  },
  {
    key: "Wilo",
    label: "Wilo",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778328995/blog-wilo-logo_jyx8to.jpg",
    accentColor: "#00A651",
  },
  {
    key: "Ecodense",
    label: "Ecodense",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329008/ECODENSE_vektorel_logo_ukeftk.png",
    accentColor: "#0D9488",
  },
  {
    key: "Honeywell",
    label: "Honeywell",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329204/Honeywell-Logo_gx6zcc.png",
    accentColor: "#ED1C24",
  },
  {
    key: "Duca",
    label: "Duca",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329200/DUCA_Credit_Union_logo.svg_oxiwwb.png",
    accentColor: "#7C3AED",
  },
  {
    key: "E.C.A.",
    label: "E.C.A.",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329113/file_a1axb2.jpg",
    accentColor: "#C41E3A",
  },
  {
    key: "Kayse",
    label: "Kayse",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329107/RutU20MpInEOHuQyUmMoco8HCH5RVDaBm2X4c6ZC_zg2yb9.jpg",
    accentColor: "#38BDF8",
  },
  {
    key: "KODSAN",
    label: "KODSAN",
    logo: "https://res.cloudinary.com/dzklhj7ze/image/upload/v1778329196/placeholder_o2zmkd.png",
    accentColor: "#2563EB",
  },
] as const;

export type ShowroomBrandKey = (typeof SHOWROOM_BRAND_NODES)[number]["key"];

/** Match showroom brand key to `Product.brand` from Horizon catalog. */
export function showroomBrandMatchesProductBrand(
  showroomKey: string,
  productBrand: string,
): boolean {
  const k = showroomKey.trim().toLowerCase().replace(/\./g, "");
  const pb = productBrand.trim().toLowerCase().replace(/\./g, "");
  if (k === pb) return true;
  if (k.includes("mitsubishi")) return pb.includes("mitsubishi");
  if (k === "eca") return pb.includes("eca");
  if (k.includes("lg")) return pb.includes("lg");
  if (k.includes("panasonic")) return pb.includes("panasonic");
  if (k.includes("hitachi")) return pb.includes("hitachi");
  if (k.includes("toshiba")) return pb.includes("toshiba");
  if (k.includes("alarko")) return pb.includes("alarko");
  if (k.includes("vaillant")) return pb.includes("vaillant");
  if (k.includes("ecodense")) return pb.includes("ecodense");
  if (k.includes("duca")) return pb.includes("duca");
  if (k.includes("tanper")) return pb.includes("tanper");
  if (k.includes("kayse")) return pb.includes("kayse");
  if (k.includes("kodsan")) return pb.includes("kodsan");
  return pb.includes(k) || k.includes(pb.split(/\s+/)[0] ?? "");
}
