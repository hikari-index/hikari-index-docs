// Pages are Markdown files under content/, rendered at build time. Links
// between pages are written as relative .md paths (so they also work when
// the files are read on GitHub) and become site addresses here.
import { Marked } from "marked";
import { base } from "$app/paths";

const files = import.meta.glob("/content/**/*.md", { query: "?raw", import: "default", eager: true });

function slugOf(path) {
  const rel = path.replace(/^\/content\//, "").replace(/\.md$/, "");
  return rel === "index" ? "" : rel.replace(/\/index$/, "");
}

function hrefOf(slug, hash = "") {
  return `${base}/${slug ? `${slug}/` : ""}${hash}`;
}

function frontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: raw.slice(m[0].length) };
}

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const idOf = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const pages = new Map();
for (const [path, raw] of Object.entries(files)) {
  const { meta, body } = frontMatter(raw);
  pages.set(slugOf(path), { path, meta, body });
}

// A relative link to another page's file, resolved against this file.
function resolveLink(fromPath, href) {
  const [target, hash] = href.split("#");
  const dir = fromPath.split("/").slice(0, -1);
  for (const part of target.split("/")) {
    if (part === "..") dir.pop();
    else if (part !== ".") dir.push(part);
  }
  const path = dir.join("/");
  if (!files[path]) throw new Error(`${fromPath}: link to ${href}, which is not a page`);
  return hrefOf(slugOf(path), hash ? `#${hash}` : "");
}

function render(slug) {
  const page = pages.get(slug);
  const toc = [];
  const used = new Set();
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) return `<h1>${inner}</h1>\n`;
        let id = idOf(text) || "section";
        while (used.has(id)) id += "-";
        used.add(id);
        if (depth === 2) toc.push({ id, text: inner.replace(/<[^>]+>/g, "") });
        return `<h${depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Link to this section" data-pagefind-ignore>#</a></h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        let out = href;
        if (/^[a-z]+:/i.test(href)) {
          const t = title ? ` title="${escapeHtml(title)}"` : "";
          return `<a href="${escapeHtml(out)}"${t} rel="noopener">${inner}</a>`;
        }
        if (/\.md(#|$)/.test(href)) out = resolveLink(page.path, href);
        else if (href.startsWith("/")) out = `${base}${href}`;
        return `<a href="${escapeHtml(out)}">${inner}</a>`;
      },
      image({ href, title, text }) {
        const src = href.startsWith("/") ? `${base}${href}` : href;
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(text)}" loading="lazy">`;
      },
      // A paragraph that is only an image becomes a figure; the image's
      // title is its caption (where the film credit goes).
      paragraph({ tokens }) {
        const only = tokens.filter((t) => !(t.type === "text" && !t.text.trim()));
        if (only.length === 1 && only[0].type === "image") {
          // Linked to itself, so a reader can open the full-size screenshot;
          // data-sveltekit-reload keeps the client router from treating the
          // image as a page (it answered 404).
          const img = `<a href="${escapeHtml(only[0].href.startsWith("/") ? `${base}${only[0].href}` : only[0].href)}" title="Open full size" target="_blank" rel="noopener" data-sveltekit-reload>${this.parser.parseInline(only)}</a>`;
          const cap = only[0].title ? `<figcaption>${marked.parseInline(only[0].title)}</figcaption>` : "";
          return `<figure>${img}${cap}</figure>\n`;
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
      // "> **Warning** ..." gets the warning rule color.
      blockquote({ tokens }) {
        const inner = this.parser.parse(tokens);
        const warn = /^<p><strong>Warning/.test(inner.trim());
        return `<blockquote${warn ? ' class="warn"' : ""}>\n${inner}</blockquote>\n`;
      },
    },
  });
  const html = marked.parse(page.body);
  return { html, toc };
}

export function slugs() {
  return [...pages.keys()];
}

export function title(slug) {
  return pages.get(slug)?.meta.title ?? slug;
}

export function getPage(slug) {
  const page = pages.get(slug);
  if (!page) return null;
  const { html, toc } = render(slug);
  return { slug, title: page.meta.title ?? slug, description: page.meta.description ?? "", html, toc };
}

export { hrefOf };
