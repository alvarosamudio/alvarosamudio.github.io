<script lang="ts">
  import { siteConfig } from "$lib/constants"

  const linkIcons: Record<string, string> = {
    Blog: "📝",
    ZhiHu: "知",
    Instagram: "📷",
    Reddit: "💬",
    Github: "🐙",
  }
</script>

<div class="profile">
  <a href="/archives">
    <img src={siteConfig.avatar} alt={siteConfig.author} width={128} height={128} class="profile-avatar" />
  </a>
  <h1 class="profile-nickname">{siteConfig.author}</h1>
  <div class="profile-description">
    {@html siteConfig.description.replace(/\n/g, "<br>")}
  </div>
  <div class="profile-links">
    {#each Object.entries(siteConfig.links) as [label, href]}
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        class="profile-link"
        title={label}
      >
        {linkIcons[label] || label.slice(0, 2)}
      </a>
    {/each}
  </div>
</div>
