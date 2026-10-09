// The sidebar, in reading order. Each entry is a page's slug (its path under
// content/ without .md; "" is the front page). Titles come from the pages'
// own front matter, so a page is named in one place.
export const groups = [
  { title: "Start", pages: ["", "requirements"] },
  { title: "Install", pages: ["install", "install/shoko", "install/second-machine"] },
  {
    title: "Use",
    pages: ["use/browsing", "use/search", "use/adding", "use/jobs", "use/review", "use/workbench", "use/pool", "use/finishing"],
  },
  { title: "Keep it running", pages: ["run/troubleshooting", "run/backups", "run/updating"] },
  { title: "Reference", pages: ["reference/settings", "reference/how-it-works", "reference/labels", "credits"] },
];

export const order = groups.flatMap((g) => g.pages);
