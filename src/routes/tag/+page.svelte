<script lang="ts">
  let { data }: { data: { tags: Record<string, number> } } = $props()
</script>

<div class="page-container">
  <h1 class="page-title">Tags</h1>
  {#if Object.keys(data.tags).length === 0}
    <p class="empty-message">No tags yet.</p>
  {:else}
    <div class="tag-cloud">
      {#each Object.entries(data.tags) as [tag, count]}
        <a href={`/tag/${encodeURIComponent(tag)}`} class="tag-item">
          {tag}<sup class="tag-count">{count}</sup>
        </a>
      {/each}
    </div>
  {/if}
</div>
