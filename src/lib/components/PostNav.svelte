<script lang="ts">
  import type { PostMeta } from "$lib/constants"

  let { prev, next }: { prev: PostMeta | null; next: PostMeta | null } = $props()
</script>

<div class="post-nav">
  {#if prev}
    <a href={`/posts/${prev.slug}`} class="post-nav-prev">
      <span class="post-nav-arrow">‹</span>
      <span>{prev.title}</span>
    </a>
  {:else}
    <span></span>
  {/if}
  {#if next}
    <a href={`/posts/${next.slug}`} class="post-nav-next">
      <span>{next.title}</span>
      <span class="post-nav-arrow">›</span>
    </a>
  {:else}
    <span></span>
  {/if}
</div>
