// Serves build/ the way GitHub Pages will: static files, a trailing-slash
// folder answers with its index.html, anything else is 404.html. `vite
// preview` does not serve the Pagefind index, so search needs this.
//   node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = "build";
const PORT = Number(process.argv[2] ?? 5291);
const BASE = process.env.BASE_PATH ?? "";
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
  ".pf_meta": "application/octet-stream",
  ".pf_index": "application/octet-stream",
  ".pf_fragment": "application/octet-stream",
};

async function file(path) {
  try {
    const s = await stat(path);
    if (s.isDirectory()) return file(join(path, "index.html"));
    return path;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  const target = normalize(join(ROOT, p));
  const found = target.startsWith(normalize(ROOT)) ? await file(target) : null;
  const path = found ?? join(ROOT, "404.html");
  res.writeHead(found ? 200 : 404, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
  res.end(await readFile(path));
}).listen(PORT, () => console.log(`http://localhost:${PORT}${BASE}/`));
