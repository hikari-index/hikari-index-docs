// Holds the settings page to the tool's list of settings.
//
//   node scripts/check-settings.mjs        (also the first step of `npm run build`)
//
// settings.json here is a copy of settings.json in hikari-index/hikari-index:
// the one list of what a person can set, with one default each, whichever
// way the tool is installed. The page once stated a default the tool had on
// only one way of installing; this is what stops that. Checked:
//
//   - content/reference/settings.md has a table row for every setting, in
//     the right part of the page ("On a second machine" for that route's,
//     above it for the rest), and a row for nothing else;
//   - a row says "Default `x`" with the list's default, and a setting with
//     no default says no "Default `...`" at all;
//   - content/install/unraid.md names every setting the all-in-one
//     container takes, and where its table gives one a default, it is the
//     list's for that route;
//   - with HIKARI_TOOL_SETTINGS=<path to the tool's settings.json>, that
//     this copy is the same file (the publish workflow passes the newest
//     release's).
//
// Not checked: the rest of a row's wording, or any other page.
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const copy = read("settings.json");
const { settings } = JSON.parse(copy);
const page = read("content/reference/settings.md");
const problems = [];

const SECOND = "On a second machine";
const routes = { compose: "the main part of the settings page", "second-machine": `"${SECOND}" on the settings page` };

// route -> name on that route -> setting
const wanted = Object.fromEntries(Object.keys(routes).map((route) => [route, new Map()]));
for (const s of settings) {
  for (const route of s.routes) wanted[route]?.set(s.names?.[route] ?? s.name, s);
}

const rows = Object.fromEntries(Object.keys(routes).map((route) => [route, new Map()]));
let route = "compose";
for (const line of page.split("\n")) {
  const heading = line.match(/^## (.*)$/);
  if (heading) route = heading[1].trim() === SECOND ? "second-machine" : "compose";
  const row = line.match(/^\|\s*`([A-Z][A-Z0-9_]*)`\s*\|(.*)$/);
  if (!row) continue;
  if (rows[route].has(row[1])) problems.push(`${routes[route]} has two rows for ${row[1]}`);
  rows[route].set(row[1], row[2]);
}
if (!page.includes(`\n## ${SECOND}\n`)) problems.push(`the settings page has no "${SECOND}" heading; this check tells the two routes apart by it`);

for (const [name, where] of Object.entries(routes)) {
  for (const found of [...rows[name].keys()].sort()) {
    if (!wanted[name].has(found)) problems.push(`${where} has a row for ${found}, which settings.json does not list there`);
  }
  for (const [setting, s] of [...wanted[name]].sort()) {
    const row = rows[name].get(setting);
    if (row === undefined) {
      problems.push(`settings.json lists ${setting}, and ${where} has no row for it`);
      continue;
    }
    const stated = [...row.matchAll(/Default `([^`]*)`/g)].map((m) => m[1]);
    if (s.default && (stated.length !== 1 || stated[0] !== s.default)) {
      problems.push(`${where}: the row for ${setting} must say "Default \`${s.default}\`" once; it says ${stated.length ? stated.map((d) => `\`${d}\``).join(", ") : "no default"}`);
    }
    if (!s.default && stated.length) {
      problems.push(`${where}: the row for ${setting} says "Default \`${stated[0]}\`"; settings.json gives it none`);
    }
  }
}

// The unRAID page: the all-in-one container's settings.
const unraid = read("content/install/unraid.md");
for (const s of settings.filter((s) => s.routes.includes("all-in-one"))) {
  if (!unraid.includes(`\`${s.name}\``)) {
    problems.push(`settings.json lists ${s.name} for the all-in-one, and the unRAID page never names it`);
    continue;
  }
  const row = unraid.split("\n").find((line) => new RegExp(`^\\|[^|]*\\|\\s*\`${s.name}\`\\s*\\|`).test(line));
  const wanted = s.default_on?.["all-in-one"] ?? s.default;
  if (row && wanted && !row.split("|")[3].includes(`\`${wanted}\``)) {
    problems.push(`the unRAID page's row for ${s.name} must give its default, \`${wanted}\``);
  }
}

const tool = process.env.HIKARI_TOOL_SETTINGS;
if (tool && readFileSync(tool, "utf8").replace(/\r\n/g, "\n") !== copy) {
  problems.push(`settings.json here is not the tool's (${tool}); copy the tool's over it, then bring the settings page in line`);
}

if (problems.length) {
  console.error(`${problems.length} difference(s) between the settings page and settings.json:`);
  for (const line of problems) console.error(`  - ${line}`);
  process.exit(1);
}
const count = Object.values(wanted).reduce((n, m) => n + m.size, 0);
console.log(`settings page: ${count} rows agree with settings.json${tool ? ", and settings.json is the tool's" : ""}`);
