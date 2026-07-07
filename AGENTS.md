<!--
Custom AGENTS.md instructions for this project.

Stack: SvelteKit 2, Svelte 5, Vite 6, TypeScript, Bun
License: GPL-3.0-only
Author: Alvaro Samudio <alvarosamudio@protonmail.com>
URL: https://alvarosamudio.github.io

Commands:
  bun run dev     — development server
  bun run build   — build for production (outputs to out/)
  bun run preview — preview production build

Architecture:
  - src/             — SvelteKit app source
  - src/lib/         — Library code (components, utilities)
  - src/lib/posts.ts — File-system markdown parsing with gray-matter
  - src/lib/markdown.ts — marked renderer with highlight.js (only used languages)
  - src/routes/      — SvelteKit pages
  - content/posts/   — Markdown blog posts in Spanish
  - static/          — Static assets (favicon.ico)

Key decisions:
  - Static site via @sveltejs/adapter-static (prerender = true)
  - 404 via +error.svelte, fallback "404.html"
  - Dark/light theme via CSS variables + sessionStorage
  - All posts, categories, tags prerendered via entries()
  - highlight.js imports only 7 languages (css, dockerfile, html, javascript, json, sql, typescript)
  - GPL-3.0 license
-->

