import adapter from "@sveltejs/adapter-static";

// BASE_PATH is "/hikari-index-docs" while the site is served as a GitHub
// project page, and empty once it has its own domain.
export default {
  kit: {
    adapter: adapter({ fallback: "404.html" }),
    paths: { base: process.env.BASE_PATH ?? "" },
    prerender: { handleHttpError: "fail", handleMissingId: "fail" },
  },
};
