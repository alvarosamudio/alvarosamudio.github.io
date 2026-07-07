<script lang="ts">
  let { data }: { data: { categories: Record<string, number> } } = $props()
</script>

<div class="page-container">
  <h1 class="page-title">Categories</h1>
  {#if Object.keys(data.categories).length === 0}
    <p class="empty-message">No categories yet.</p>
  {:else}
    <div class="category-cards">
      {#each Object.entries(data.categories) as [cat, count]}
        <div class="category-card">
          <a href={`/category/${encodeURIComponent(cat)}`}>
            <h2>{cat}</h2>
            <span class="category-count">{count} posts</span>
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div>
