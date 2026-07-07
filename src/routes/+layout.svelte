<script lang="ts">
  import "../app.css"
  import Header from "$lib/components/Header.svelte"
  import Footer from "$lib/components/Footer.svelte"

  let { children }: { children: import("svelte").Snippet } = $props()

  let theme = $state(false)
  let mounted = $state(false)

  $effect(() => {
    if (!mounted) {
      const stored = sessionStorage.getItem("theme")
      theme = stored === "dark"
      document.documentElement.classList.toggle("dark-theme", theme)
      mounted = true
    }
  })

  function toggleTheme() {
    theme = !theme
    const val = theme ? "dark" : "light"
    sessionStorage.setItem("theme", val)
    document.documentElement.classList.toggle("dark-theme", theme)
  }
</script>

<div class="wrapper">
  <Header {theme} onToggleTheme={toggleTheme} />
  <main class="main">
    {@render children()}
  </main>
  <Footer />
</div>
