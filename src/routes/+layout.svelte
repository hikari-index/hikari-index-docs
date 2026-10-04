<script>
  import "../app.css";
  import { page } from "$app/state";
  import { base } from "$app/paths";
  import { groups } from "$lib/nav.js";
  import { hrefOf, title } from "$lib/content.js";
  import Search from "$lib/Search.svelte";
  let { children } = $props();

  const current = $derived(page.url.pathname.slice(base.length).replace(/^\/|\/$/g, ""));
  let menuOpen = $state(false);
  $effect(() => {
    current; // close the phone menu after each navigation
    menuOpen = false;
  });
</script>

<a class="skip" href="#main">Skip to content</a>
<header>
  <a class="brand" href="{base}/">Hikari Index <span>docs</span></a>
  <button class="menu" aria-expanded={menuOpen} aria-controls="sidebar" onclick={() => (menuOpen = !menuOpen)}>Contents</button>
  <Search />
  <a class="repo" href="https://github.com/hikari-index/hikari-index" rel="noopener">GitHub</a>
</header>

<div class="shell">
  <nav id="sidebar" class:open={menuOpen} aria-label="Docs">
    {#each groups as g (g.title)}
      <span class="label">{g.title}</span>
      <ul>
        {#each g.pages as slug (slug)}
          <li>
            <a href={hrefOf(slug)} aria-current={slug === current ? "page" : undefined}>{slug === "" ? "Overview" : title(slug)}</a>
          </li>
        {/each}
      </ul>
    {/each}
  </nav>
  <main id="main">
    {@render children()}
    <footer>
      Hikari Index is free software under the AGPL-3.0-or-later. Frames in the
      screenshots are from Blender Studio's open films, licensed CC BY
      (<a href={hrefOf("credits")}>credits</a>).
    </footer>
  </main>
</div>

<style>
  .skip {
    position: absolute;
    left: -999px;
    top: 0;
    background: var(--text-1);
    color: var(--bg-0);
    padding: 0.5rem 1rem;
  }
  .skip:focus {
    left: 0;
    z-index: 30;
  }
  header {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s-2) var(--s-6);
    align-items: center;
    min-height: 56px;
    padding: var(--s-2) var(--gutter);
    box-sizing: border-box;
    border-bottom: 1px solid var(--line-1);
  }
  .brand {
    font: 500 var(--t-label) / 1 var(--font-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-1);
    text-decoration: none;
    white-space: nowrap;
  }
  .brand span {
    color: var(--text-3);
    margin-left: var(--s-1);
  }
  .repo {
    font-size: var(--t-ui);
    color: var(--text-2);
    text-decoration: none;
  }
  .repo:hover {
    color: var(--text-1);
  }
  .menu {
    display: none;
    font: inherit;
    font-size: var(--t-ui);
    color: var(--text-2);
    background: var(--bg-1);
    border: 1px solid var(--line-input);
    height: 32px;
    padding: 0 var(--s-3);
    cursor: pointer;
  }
  .shell {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: var(--s-7);
    max-width: 1320px;
    padding: 0 var(--gutter);
  }
  nav {
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 100vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--line-2) transparent;
    padding: var(--s-6) 0 var(--s-7);
    box-sizing: border-box;
  }
  nav .label {
    margin: var(--s-5) 0 var(--s-2);
  }
  nav .label:first-child {
    margin-top: 0;
  }
  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  nav a {
    display: block;
    padding: 3px 0 3px var(--s-3);
    font-size: var(--t-ui);
    color: var(--text-2);
    text-decoration: none;
    border-left: 2px solid transparent;
  }
  nav a:hover {
    color: var(--text-1);
  }
  nav a[aria-current="page"] {
    color: var(--text-1);
    border-left-color: var(--accent);
  }
  main {
    min-width: 0;
    padding: var(--s-6) 0 var(--s-7);
  }
  footer {
    max-width: var(--measure);
    margin-top: var(--s-6);
    font-size: var(--t-meta);
    color: var(--text-3);
  }
  footer a {
    color: var(--text-2);
  }
  @media (max-width: 900px) {
    .shell {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;
    }
    .menu {
      display: block;
    }
    /* brand, Contents and GitHub on one row; search under them */
    header :global(.search) {
      order: 3;
      flex-basis: 100%;
      margin-left: 0;
    }
    header :global(.search input) {
      width: 100%;
    }
    .repo {
      margin-left: auto;
    }
    nav {
      display: none;
      position: static;
      max-height: none;
      padding: var(--s-4) 0;
      border-bottom: 1px solid var(--line-1);
    }
    nav.open {
      display: block;
    }
    main {
      padding-top: var(--s-5);
    }
  }
</style>
