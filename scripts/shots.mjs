// Screenshots for the docs, taken from a running Hikari Index install that
// holds only openly licensed films (the Blender Studio open films). Never
// point this at a personal library: whatever the gallery shows ends up in
// a public repository.
//
//   HIKARI_DOCS_GALLERY=http://localhost:5283 \
//   HIKARI_DOCS_PASSWORD=<that install's admin password> \
//   node scripts/shots.mjs [name ...]
//
// With no names it takes every shot. Each lands in static/shots/<name>.avif.
// Needs a Chromium-based browser; BROWSER names its executable (default:
// Microsoft Edge on Windows).
import { mkdir, unlink } from "node:fs/promises";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const GALLERY = (process.env.HIKARI_DOCS_GALLERY ?? "http://localhost:5283").replace(/\/$/, "");
const PASSWORD = process.env.HIKARI_DOCS_PASSWORD ?? "";
const BROWSER = process.env.BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT = "static/shots";
const VIEW = { width: 1280, height: 800, deviceScaleFactor: 1.5 };

const settle = (page) => page.evaluate(() => document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 400))));
async function lazyImages(page) {
  // Load every lazy image on the page before the shot.
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll("img[loading=lazy]")) img.loading = "eager";
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
  });
}

// name: [path, { admin, height, prepare(page) }]
const SHOTS = {
  explore: ["/", {}],
  "explore-mood": ["/?mode=mood&q=a%20lonely%20figure%20in%20a%20dark%20room", {}],
  sheet: ["/series/charge", {}],
  still: ["/still/charge/cand-0020", { height: 1000 }],
  similar: ["/similar/charge/cand-0020", {}],
  palette: ["/palette", { height: 900 }],
  techniques: ["/composition", {}],
  review: ["/admin", { admin: true, prepare: (p) => p.evaluate(() => document.querySelectorAll("main details").forEach((d) => (d.open = true))) }],
  "worth-a-look": ["/admin/exceptions", { admin: true }],
  workbench: ["/admin/works/charge", { admin: true }],
  editor: ["/admin/stills/charge/cand-0020", { admin: true, height: 900 }],
  pool: ["/admin/works/charge/pool", { admin: true }],
  "post-card": ["/admin/stills/hero/cand-0056/card", { admin: true, height: 1000 }],
  jobs: ["/admin/jobs", { admin: true }],
  discard: ["/admin/discard?scope=work&id=hero", { admin: true, height: 640 }],
  "onboard-local": [
    "/admin/onboard/local",
    {
      admin: true,
      height: 1000,
      async prepare(page) {
        await page.type("input[name=path]", "Blender/Spring.mkv");
        await page.click("input[name=kind][value=movie]");
        await page.type("input[name=title]", "Spring");
        await page.type("input[name=group]", "Blender Studio");
        await page.evaluate(() => document.activeElement?.blur());
      },
    },
  ],
};

async function signIn(page) {
  if (!PASSWORD) throw new Error("HIKARI_DOCS_PASSWORD is not set");
  await page.goto(`${GALLERY}/admin/login`, { waitUntil: "networkidle0" });
  await page.type("main input:not([type=password]):not([type=hidden])", "admin");
  await page.type("input[type=password]", PASSWORD);
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.keyboard.press("Enter")]);
  if (page.url().includes("/admin/login")) throw new Error("sign-in failed");
}

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(SHOTS);
for (const n of names) if (!SHOTS[n]) throw new Error(`no shot named ${n}`);

await mkdir(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: BROWSER, headless: true, args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
try {
  const page = await browser.newPage();
  let signedIn = false;
  for (const name of names) {
    const [path, opt] = SHOTS[name];
    if (opt.admin && !signedIn) {
      await signIn(page);
      signedIn = true;
    }
    await page.setViewport({ ...VIEW, height: opt.height ?? VIEW.height });
    await page.goto(`${GALLERY}${path}`, { waitUntil: "networkidle0" });
    if (opt.prepare) await opt.prepare(page);
    await lazyImages(page);
    await settle(page);
    const png = `${OUT}/${name}.tmp.png`;
    await page.screenshot({ path: png });
    // AVIF 4:4:4 keeps small UI text clean (the gallery's own web images
    // use the same setting for the same reason).
    const info = await sharp(png).avif({ quality: 70, chromaSubsampling: "4:4:4", effort: 6 }).toFile(`${OUT}/${name}.avif`);
    await unlink(png);
    console.log(`${name}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
  }
} finally {
  await browser.close();
}
