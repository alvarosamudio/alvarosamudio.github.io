<script lang="ts">
  import { onMount } from "svelte"

  type TocItem = { id: string; text: string; level: number }

  let items = $state<TocItem[]>([])
  let activeId = $state("")

  onMount(() => {
    const headers = document.querySelectorAll<HTMLHeadingElement>(
      ".post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6",
    )
    const toc: TocItem[] = []
    headers.forEach((h) => {
      if (!h.id) {
        h.id =
          h.textContent
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "") || ""
      }
      toc.push({ id: h.id, text: h.textContent || "", level: parseInt(h.tagName[1], 10) })
    })
    items = toc

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    )
    headers.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  })
</script>

{#if items.length > 0}
  <aside class="post-toc">
    <nav class="toc-nav">
      {#each items as item}
        <a
          href={`#${item.id}`}
          class="toc-link toc-level-{item.level}"
          class:active={activeId === item.id}
          onclick={(e) => {
            e.preventDefault()
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          {item.text}
        </a>
      {/each}
    </nav>
    <div class="toc-actions">
      <button onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ↑ Back to top
      </button>
      <button onclick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
        ↓ Go to bottom
      </button>
    </div>
  </aside>
{/if}
