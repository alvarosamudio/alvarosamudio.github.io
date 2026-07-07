<script lang="ts">
  let { current, total, basePath }: { current: number; total: number; basePath: string } = $props()

  let pages = $derived.by(() => {
    if (total <= 1) return null
    const p: (number | "...")[] = []
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        p.push(i)
      } else if (p[p.length - 1] !== "...") {
        p.push("...")
      }
    }
    return p
  })
</script>

{#if pages}
  <nav class="paginator">
    {#each pages as p, i}
      {#if p === "..."}
        <span class="paginator-dots">...</span>
      {:else}
        <a
          href={p === 1 ? basePath : `${basePath}/page/${p}`}
          class="paginator-page"
          class:active={p === current}
        >
          {p}
        </a>
      {/if}
    {/each}
  </nav>
{/if}
