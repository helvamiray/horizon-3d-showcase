/**
 * public/img/*.png → .webp (quality 82), then delete PNGs.
 * Run: node scripts/convert-img-png-to-webp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function convertDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) continue;
    if (!name.toLowerCase().endsWith(".png")) continue;
    const out = full.replace(/\.png$/i, ".webp");
    await sharp(full).webp({ quality: 82 }).toFile(out);
    fs.unlinkSync(full);
    console.log("converted:", path.relative(root, out));
  }
}

await convertDir(path.join(root, "public", "img"));
