import { error } from "@sveltejs/kit";
import { getPage, slugs } from "$lib/content.js";
import { order } from "$lib/nav.js";

export function entries() {
  return slugs().map((slug) => ({ slug }));
}

export function load({ params }) {
  const page = getPage((params.slug ?? "").replace(/\/$/, ""));
  if (!page) error(404, "No such page");
  const i = order.indexOf(page.slug);
  const prev = i > 0 ? order[i - 1] : null;
  const next = i >= 0 && i < order.length - 1 ? order[i + 1] : null;
  return { page, prev, next };
}
