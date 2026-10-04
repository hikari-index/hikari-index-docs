<script>
  import { hrefOf, title } from "$lib/content.js";
  let { data } = $props();
  const page = $derived(data.page);
  let article = $state();

  // A copy button on every code block. Added after render because the
  // page body is HTML from the Markdown, not components.
  $effect(() => {
    page.html; // re-run when the page changes
    for (const pre of article?.querySelectorAll("pre") ?? []) {
      if (pre.querySelector(".copy")) continue;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy";
      button.textContent = "copy";
      button.setAttribute("aria-label", "Copy this command");
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? pre.innerText);
          button.textContent = "copied";
        } catch {
          button.textContent = "select and copy";
        }
        setTimeout(() => (button.textContent = "copy"), 1500);
      });
      pre.append(button);
    }
  });
</script>

<svelte:head>
  <title>{page.slug ? `${page.title} · Hikari Index docs` : "Hikari Index docs"}</title>
  {#if page.description}<meta name="description" content={page.description} />{/if}
</svelte:head>

<div class="page">
  <div class="body">
    {#if page.toc.length > 2}
      <details class="toc-top">
        <summary>On this page</summary>
        <ul>
          {#each page.toc as h (h.id)}
            <li><a href="#{h.id}">{h.text}</a></li>
          {/each}
        </ul>
      </details>
    {/if}
    <article class="prose" data-pagefind-body bind:this={article}>
      {@html page.html}
    </article>

    <nav class="pager" aria-label="Previous and next page">
      {#if data.prev !== null}
        <a href={hrefOf(data.prev)} rel="prev"><span class="label">Previous</span>{title(data.prev)}</a>
      {:else}<span></span>{/if}
      {#if data.next !== null}
        <a href={hrefOf(data.next)} rel="next" class="next"><span class="label">Next</span>{title(data.next)}</a>
      {/if}
    </nav>
  </div>

  {#if page.toc.length > 2}
    <aside class="toc" aria-label="On this page">
      <span class="label">On this page</span>
      <ul>
        {#each page.toc as h (h.id)}
          <li><a href="#{h.id}">{h.text}</a></li>
        {/each}
      </ul>
    </aside>
  {/if}
</div>

<style>
  .page {
    display: grid;
    grid-template-columns: minmax(0, var(--column)) 200px;
    gap: var(--s-7);
    justify-content: start;
  }
  .body {
    min-width: 0;
  }
  .toc {
    position: sticky;
    top: var(--s-5);
    align-self: start;
    font-size: var(--t-meta);
  }
  .toc ul,
  .toc-top ul {
    list-style: none;
    margin: var(--s-2) 0 0;
    padding: 0;
  }
  .toc li,
  .toc-top li {
    margin: 0 0 var(--s-2);
  }
  .toc a,
  .toc-top a {
    color: var(--text-3);
    text-decoration: none;
  }
  .toc a:hover,
  .toc-top a:hover {
    color: var(--text-1);
  }
  .toc-top {
    display: none;
    margin: 0 0 var(--s-5);
    padding: var(--s-2) var(--s-3);
    border: 1px solid var(--line-1);
    font-size: var(--t-ui);
  }
  .toc-top summary {
    cursor: pointer;
    color: var(--text-2);
  }
  .pager {
    display: flex;
    justify-content: space-between;
    gap: var(--s-4);
    margin-top: var(--s-7);
    padding-top: var(--s-4);
    border-top: 1px solid var(--line-1);
  }
  .pager a {
    display: grid;
    gap: var(--s-1);
    font-size: var(--t-ui);
    text-decoration: none;
    color: var(--text-2);
  }
  .pager a:hover {
    color: var(--text-1);
  }
  .pager .next {
    text-align: right;
    margin-left: auto;
  }
  @media (max-width: 1180px) {
    .page {
      grid-template-columns: minmax(0, var(--column));
    }
    .toc {
      display: none;
    }
    .toc-top {
      display: block;
    }
  }
</style>
