<script lang="ts">
  let { data }: { data: { grouped: Record<string, Array<{ slug: string; title: string; date: string }>>; total: number } } = $props()
</script>

<div class="page-container">
  <h1 class="page-title">Archives</h1>
  {#each Object.entries(data.grouped) as [year, yearPosts]}
    <div class="archive-year">
      <h2 class="archive-year-title">{year}</h2>
      {#each yearPosts as post}
        <div class="archive-item">
          <span class="archive-date">{post.date?.replace(/-/g, "/")}</span>
          <a href={`/posts/${post.slug}`} class="archive-link">{post.title}</a>
        </div>
      {/each}
    </div>
  {/each}
  {#if data.total === 0}
    <p class="empty-message">No posts yet.</p>
  {/if}
</div>
