<script>
  import { hrefOf, title } from "$lib/content.js";
  let { data } = $props();
  const page = $derived(data.page);
</script>

<svelte:head>
  <title>{page.slug ? `${page.title} · Hikari Index docs` : "Hikari Index docs"}</title>
  {#if page.description}<meta name="description" content={page.description} />{/if}
</svelte:head>

<div class="page">
  <article class="prose" data-pagefind-body>
    {@html page.html}
  </article>

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

<nav class="pager" aria-label="Previous and next page">
  {#if data.prev !== null}
    <a href={hrefOf(data.prev)} rel="prev"><span class="label">Previous</span>{title(data.prev)}</a>
  {:else}<span></span>{/if}
  {#if data.next !== null}
    <a href={hrefOf(data.next)} rel="next" class="next"><span class="label">Next</span>{title(data.next)}</a>
  {/if}
</nav>

<style>
  .page {
    display: grid;
    grid-template-columns: minmax(0, var(--measure)) 200px;
    gap: var(--s-7);
    justify-content: start;
  }
  .toc {
    position: sticky;
    top: var(--s-5);
    align-self: start;
    font-size: var(--t-meta);
  }
  .toc ul {
    list-style: none;
    margin: var(--s-2) 0 0;
    padding: 0;
  }
  .toc li {
    margin: 0 0 var(--s-2);
  }
  .toc a {
    color: var(--text-3);
    text-decoration: none;
  }
  .toc a:hover {
    color: var(--text-1);
  }
  .pager {
    display: flex;
    justify-content: space-between;
    gap: var(--s-4);
    max-width: var(--measure);
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
      grid-template-columns: minmax(0, var(--measure));
    }
    .toc {
      display: none;
    }
  }
</style>
