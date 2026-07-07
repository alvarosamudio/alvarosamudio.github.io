<script lang="ts">
  import { siteConfig } from "$lib/constants"
  import ThemeToggle from "./ThemeToggle.svelte"

  let { theme = false, onToggleTheme = () => {} }: { theme: boolean; onToggleTheme: () => void } = $props()

  let menuOpen = $state(false)
</script>

<header class="navbar">
  <div class="navbar-inner">
    <a href="/" class="logo">{siteConfig.title}</a>

    <nav class="nav-desktop">
      {#each Object.entries(siteConfig.nav) as [label, href]}
        <a href={href} class="nav-link">{label}</a>
      {/each}
      <ThemeToggle checked={theme} onToggle={onToggleTheme} />
    </nav>

    <button class="mobile-menu-btn" onclick={() => menuOpen = !menuOpen} aria-label="Menu">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    </button>
  </div>

  {#if menuOpen}
    <nav class="nav-mobile">
      {#each Object.entries(siteConfig.nav) as [label, href]}
        <a href={href} class="nav-link" onclick={() => menuOpen = false}>{label}</a>
      {/each}
      <div class="mobile-toggle-wrapper">
        <ThemeToggle checked={theme} onToggle={onToggleTheme} />
      </div>
    </nav>
  {/if}
</header>
