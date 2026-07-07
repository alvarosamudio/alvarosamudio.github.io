<script lang="ts">
  import { renderMarkdown } from "$lib/markdown"

  let { content }: { content: string } = $props()

  let html = $derived(renderMarkdown(content))
</script>

<div class="post-content">
  {@html html}
</div>
