<script lang="ts">
  import type { PostMeta } from "$lib/constants"
  import { siteConfig } from "$lib/constants"
  import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte"
  import PostNav from "$lib/components/PostNav.svelte"
  import TOC from "$lib/components/TOC.svelte"

  let { data }: { data: { post: PostMeta; prev: PostMeta | null; next: PostMeta | null; permalink: string } } = $props()
</script>

<div class="post-layout">
  <article class="post-article">
    <header class="post-header">
      <h1 class="post-title">{data.post.title}</h1>
      <div class="post-meta">
        {#if siteConfig.author}
          <span class="post-author">{siteConfig.author}</span>
        {/if}
        {#if data.post.date}
          <span class="post-date">{data.post.date}</span>
        {/if}
        {#if data.post.categories.length > 0}
          <span class="post-categories">{data.post.categories.join(", ")}</span>
        {/if}
      </div>
    </header>

    <MarkdownRenderer content={data.post.content} />

    <PostNav prev={data.prev} next={data.next} />
  </article>

  <TOC />
</div>
