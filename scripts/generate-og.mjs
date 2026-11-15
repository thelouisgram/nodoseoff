/**
 * Generate public/og-image.jpg (1200×630) for Open Graph / Twitter cards.
 * Brand-first: hero photo + white wordmark + one tagline (no blue-on-blue).
 *
 * Usage: node scripts/generate-og.mjs
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1200;
const H = 630;
const MINT = "#3dcfb6";

const heroPath = join(root, "public/assets/hero/old-man.jpg");
const logoPath = join(root, "public/assets/logo/logo-with-name-white.png");
const outJpg = join(root, "public/og-image.jpg");
const stalePng = join(root, "public/og-image.png");

const logoBuf = await sharp(logoPath)
  .resize({ width: 520, withoutEnlargement: true })
  .png()
  .toBuffer();
const logoMeta = await sharp(logoBuf).metadata();
const logoW = logoMeta.width ?? 520;
const logoH = logoMeta.height ?? 104;

const logoLeft = Math.round((W - logoW) / 2);
const logoTop = 168;

const overlaySvg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#031428" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#031428" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#031428" stop-opacity="0.78"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#veil)"/>
  <rect x="${Math.round(W / 2 - 36)}" y="${logoTop + logoH + 28}" width="72" height="3" rx="1.5" fill="${MINT}"/>
  <text
    x="${W / 2}"
    y="${logoTop + logoH + 72}"
    text-anchor="middle"
    font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif"
    font-size="34"
    font-weight="500"
    fill="#ffffff"
    letter-spacing="0.02em"
  >Never miss a dose again</text>
</svg>`,
);

const background = await sharp(heroPath)
  .rotate()
  .resize(W, H, { fit: "cover", position: "attention" })
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer();

await sharp(background)
  .composite([
    { input: overlaySvg, top: 0, left: 0 },
    { input: logoBuf, top: logoTop, left: logoLeft },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(outJpg);

if (existsSync(stalePng)) {
  unlinkSync(stalePng);
}

const meta = await sharp(outJpg).metadata();
const size = readFileSync(outJpg).byteLength;
console.log(
  `Wrote ${outJpg} (${meta.width}×${meta.height}, ${(size / 1024).toFixed(1)} KB)`,
);
if (existsSync(stalePng)) {
  console.warn("Warning: stale og-image.png still present");
} else {
  console.log("Removed public/og-image.png");
}
