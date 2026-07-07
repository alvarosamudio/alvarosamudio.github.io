<script lang="ts">
  import type { PostMeta } from "$lib/constants"

  let { data }: { data: { name: string; posts: PostMeta[] } } = $props()
</script>

<div class="page-container">
  <h1 class="page-title">
    Category: <span class="page-subtitle">{data.name}</span>
  </h1>
  {#each data.posts as post}
    <div class="archive-item">
      <span class="archive-date">{post.date?.replace(/-/g, "/")}</span>
      <a href={`/posts/${post.slug}`} class="archive-link">{post.title}</a>
    </div>
  {/each}
</div>
