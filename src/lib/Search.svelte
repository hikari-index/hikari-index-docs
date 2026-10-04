<script>
  // Pagefind's index is made after the build (npm run build), so search
  // works on the built site and says so under `vite dev`.
  import { base } from "$app/paths";
  let query = $state("");
  let results = $state([]);
  let note = $state("");
  let open = $state(false);
  let pagefind;

  async function load() {
    if (pagefind !== undefined) return pagefind;
    try {
      pagefind = await import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`);
      await pagefind.init();
    } catch {
      pagefind = null;
    }
    return pagefind;
  }

  async function run() {
    open = true;
    const q = query.trim();
    if (!q) {
      results = [];
      note = "";
      return;
    }
    const pf = await load();
    if (!pf) {
      note = "Search works on the built site.";
      return;
    }
    const found = await pf.debouncedSearch(q, {}, 200);
    if (found === null) return; // superseded by a newer keystroke
    results = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
    note = results.length ? "" : "Nothing found.";
  }

  function onkeydown(e) {
    e.stopPropagation(); // the results' own key handler is for the links
    if (e.key === "Escape") {
      open = false;
      e.currentTarget.blur();
    } else if (e.key === "Enter" && results.length) {
      e.preventDefault();
      box.querySelector(".results a")?.click();
    } else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      box.querySelector(".results a")?.focus();
    }
  }

  // Close only when focus leaves the whole search (box and results), so Tab
  // and the arrow keys can move into the results.
  function onfocusout(e) {
    if (!box.contains(e.relatedTarget)) open = false;
  }
  function resultKeys(e) {
    const links = [...box.querySelectorAll(".results a")];
    const i = links.indexOf(document.activeElement);
    if (e.key === "ArrowDown" && i < links.length - 1) {
      e.preventDefault();
      links[i + 1].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      (i > 0 ? links[i - 1] : box.querySelector("input")).focus();
    } else if (e.key === "Escape") {
      open = false;
      box.querySelector("input").focus();
    }
  }
  let box;

  function slash(e) {
    if (e.key !== "/") return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? "")) return;
    e.preventDefault();
    document.getElementById("docs-search")?.focus();
  }
</script>

<svelte:window onkeydown={slash} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="search" role="search" bind:this={box} {onfocusout} onkeydown={resultKeys}>
  <label class="sr" for="docs-search">Search the docs</label>
  <input
    id="docs-search"
    type="search"
    placeholder="Search  /"
    autocomplete="off"
    bind:value={query}
    oninput={run}
    onfocus={() => (open = true)}
    {onkeydown}
  />
  {#if open && (results.length || note)}
    <div class="results">
      {#if note}<p class="note">{note}</p>{/if}
      <ul>
        {#each results as r (r.url)}
          <li>
            <a href={r.url}>
              <strong>{r.meta?.title ?? r.url}</strong>
              <span>{@html r.excerpt}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .search {
    position: relative;
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  input {
    width: 220px;
    height: 32px;
    font-size: var(--t-ui);
  }
  .sr {
    position: absolute;
    left: -9999px;
  }
  .results {
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    width: min(440px, calc(100vw - 32px));
    max-height: 70vh;
    overflow-y: auto;
    background: var(--bg-2);
    border: 1px solid var(--line-2);
    z-index: 20;
  }
  .note {
    margin: 0;
    padding: var(--s-3);
    font-size: var(--t-ui);
    color: var(--text-3);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li a {
    display: grid;
    gap: 2px;
    padding: var(--s-2) var(--s-3);
    text-decoration: none;
    border-bottom: 1px solid var(--line-1);
  }
  li a:hover,
  li a:focus-visible {
    background: var(--bg-1);
  }
  strong {
    font-weight: 500;
    font-size: var(--t-ui);
  }
  span {
    font-size: var(--t-meta);
    color: var(--text-3);
  }
  span :global(mark) {
    background: none;
    color: var(--text-1);
    border-bottom: 1px solid var(--accent);
  }
  @media (max-width: 700px) {
    .search {
      margin-left: 0;
      width: 100%;
    }
    input {
      width: 100%;
    }
  }
</style>
