import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const mark = readFileSync(resolve(root, "public/logo-mark.svg"), "utf8");
const lockup = readFileSync(resolve(root, "public/logo.svg"), "utf8");

function scaleSvg(svg, w, h) {
  return svg
    .replace(/width="[^"]+"/, `width="${w}"`)
    .replace(/height="[^"]+"/, `height="${h}"`);
}

async function shot(page, svg, w, h, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(
    `<!doctype html><html><head><style>html,body{margin:0;background:#F6F1E8}</style></head><body>${svg}</body></html>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: out, omitBackground: false });
}

const browser = await chromium.launch();
const page = await browser.newPage();
await shot(page, scaleSvg(mark, 512, 512), 512, 512, resolve(root, "public/logo-mark-512.png"));
await shot(page, scaleSvg(mark, 180, 180), 180, 180, resolve(root, "public/apple-touch-icon.png"));
await shot(page, scaleSvg(mark, 180, 180), 180, 180, resolve(root, "public/logo-mark-180.png"));
await shot(page, scaleSvg(lockup, 1120, 256), 1120, 256, resolve(root, "public/logo-lockup.png"));
await browser.close();
writeFileSync(resolve(root, "public/.brand-raster-ok"), "ok\n");
console.log("raster ok");
