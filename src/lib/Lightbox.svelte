<script>
  // Screenshots open over the page instead of leaving it. The figures stay
  // plain links to the image, so without script they still open it.
  // Esc, the close button or a click outside the image closes; the arrow
  // keys step through the page's screenshots.
  let { root } = $props();
  let dialog;
  let shots = $state([]);
  let at = $state(0);
  const shot = $derived(shots[at]);

  function collect() {
    return [...(root?.querySelectorAll("figure > a") ?? [])].map((a) => ({
      href: a.getAttribute("href"),
      alt: a.querySelector("img")?.alt ?? "",
      caption: a.parentElement.querySelector("figcaption")?.innerHTML ?? "",
      link: a,
    }));
  }

  function onclick(e) {
    const a = e.target.closest?.("figure > a");
    if (!a || !root.contains(a) || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    shots = collect();
    at = Math.max(0, shots.findIndex((s) => s.link === a));
    dialog.showModal();
  }

  function onkeydown(e) {
    if (e.key === "ArrowRight" && at < shots.length - 1) at += 1;
    else if (e.key === "ArrowLeft" && at > 0) at -= 1;
  }

  // A click on the backdrop lands on the dialog itself, not its contents.
  function backdrop(e) {
    if (e.target === dialog) dialog.close();
  }

  $effect(() => {
    if (!root) return;
    root.addEventListener("click", onclick);
    return () => root.removeEventListener("click", onclick);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclick={backdrop} {onkeydown} aria-label={shot?.alt ?? "Screenshot"}>
  {#if shot}
    <div class="bar">
      <span class="count">{at + 1} of {shots.length}</span>
      <span class="nav">
        <button type="button" onclick={() => (at -= 1)} disabled={at === 0} aria-label="Previous screenshot">←</button>
        <button type="button" onclick={() => (at += 1)} disabled={at === shots.length - 1} aria-label="Next screenshot">→</button>
        <button type="button" onclick={() => dialog.close()} autofocus>close</button>
      </span>
    </div>
    <img src={shot.href} alt={shot.alt} />
    {#if shot.caption}<p class="cap">{@html shot.caption}</p>{/if}
  {/if}
</dialog>

<style>
  dialog {
    width: min(1920px, 96vw);
    max-width: none;
    max-height: 96vh;
    padding: var(--s-3);
    box-sizing: border-box;
    background: var(--bg-0);
    color: var(--text-1);
    border: 1px solid var(--line-2);
    overflow: auto;
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 0.8);
  }
  .bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--s-2);
    font-size: var(--t-meta);
    color: var(--text-3);
  }
  .count {
    font-family: var(--font-mono);
  }
  .nav {
    display: flex;
    gap: var(--s-2);
  }
  button {
    font: inherit;
    font-size: var(--t-ui);
    height: 28px;
    padding: 0 var(--s-3);
    color: var(--text-2);
    background: var(--bg-1);
    border: 1px solid var(--line-input);
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    color: var(--text-1);
    border-color: var(--text-3);
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
  }
  img {
    display: block;
    max-width: 100%;
    max-height: calc(96vh - 110px);
    margin: 0 auto;
    background: var(--img);
    outline: 1px solid var(--line-2); /* a dark screenshot on a dark box */
  }
  .cap {
    margin: var(--s-2) 0 0;
    font-size: var(--t-meta);
    color: var(--text-3);
  }
  .cap :global(a) {
    color: var(--text-2);
  }
</style>
