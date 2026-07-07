---
title: "Desarrollo web: HTML, CSS y JavaScript"
date: 2026-05-19
tags: [html, css, javascript, frontend, web]
categories: [desarrollo, web, tutoriales]
---

HTML, CSS y JavaScript no son solo "los tres pilares". Son una arquitectura en capas: el DOM como infraestructura, CSSOM como sistema de presentación, y JS como la capa de comportamiento que une ambos. Cuando entiendes cada capa en profundidad, los frameworks se vuelven opcionales.

## HTML semántico y accesibilidad

### ARIA y roles implícitos

Cada elemento HTML tiene un rol ARIA implícito que los lectores de pantalla usan:

```html
<nav> → rol="navigation"
<main> → rol="main"
<button> → rol="button"

<!-- No dupliques los roles implícitos -->
<nav role="navigation"> ❌ redundante
```

Usa ARIA solo cuando el HTML nativo no cubre el patrón:

```html
<div role="tablist">
  <button role="tab" aria-selected="true">Pestaña 1</button>
</div>
```

### `<dialog>` — modales sin hacks

```html
<dialog id="modal">
  <form method="dialog">
    <p>¿Confirmar acción?</p>
    <button value="cancel">Cancelar</button>
    <button value="confirm">Aceptar</button>
  </form>
</dialog>
<script>
  document.querySelector("dialog").showModal()
</script>
```

Nativa, accesible, sin overlay manual, sin z-index battles, sin focus trapping manual.

### Shadow DOM y Web Components

```javascript
class Counter extends HTMLElement {
  static observedAttributes = ["value"]
  #shadow = this.attachShadow({ mode: "open" })
  #value = 0

  constructor() {
    super()
    this.#shadow.innerHTML = `
      <style>button { padding: 0.5em; }</style>
      <button id="dec">-</button>
      <span id="val">0</span>
      <button id="inc">+</button>
    `
    this.#shadow.querySelector("#inc").onclick = () => this.#update(1)
    this.#shadow.querySelector("#dec").onclick = () => this.#update(-1)
  }

  #update(delta) {
    this.#value += delta
    this.#shadow.querySelector("#val").textContent = this.#value
    this.dispatchEvent(new CustomEvent("change", { detail: this.#value }))
  }
}

customElements.define("x-counter", Counter)
```

Encapsulamiento: CSS interno no filtra al exterior, IDs internos no chocan con el documento.

## CSS moderno (2026)

### Cascade layers — el fin de la guerra de especificidad

```css
@layer base, components, utilities;

@layer base {
  a { color: blue; }
}

@layer components {
  .card a { color: inherit; } /* gana a base aunque sea más específico */
}

@layer utilities {
  .text-red { color: red; } /* gana a todo */
}
```

El orden de las `@layer` define la precedencia. La especificidad dentro de una misma capa todavía importa, pero entre capas gana la última declarada.

### Container queries

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (width > 600px) {
  .card { display: flex; gap: 2rem; }
  .card-image { width: 40%; }
}
```

No es `@media` — es responsive a nivel de componente, no de viewport.

### `:has()` — el selector padre

```css
/* Estilo aplicado al padre basado en hijos */
form:has(input:invalid) {
  border-color: red;
}

.card:has(img:hover) {
  transform: scale(1.02);
}

/* Grid que se adapta al contenido */
.grid:has(> :nth-child(3)) {
  grid-template-columns: repeat(3, 1fr);
}
```

### View Transitions API

```javascript
document.startViewTransition(() => {
  document.querySelector("#content").innerHTML = newContent
})
```

Transiciones de página nativas, sin librerías de animación. Control total con pseudo-elementos `::view-transition-old` y `::view-transition-new`.

### Propiedades lógicas

```css
.card {
  margin-inline: auto;
  padding-block: 1rem;
  border-inline-start: 3px solid blue;
}
```

Funcionan en cualquier dirección de escritura (LTR, RTL, vertical). No más `margin-left` que rompe en árabe.

## Rendimiento real

- **LCP** (Largest Contentful Paint): Causado por imágenes sin `fetchpriority`, fuentes lentas, CSS blocking.
- **INP** (Interaction to Next Paint): Causado por JS síncrono en main thread, listeners lentos, layout thrashing.
- **CLS** (Cumulative Layout Shift): Causado por imágenes sin dimensiones, ads dinámicos, web fonts sin `font-display`.

```html
<img src="hero.webp" width="1200" height="600" loading="lazy" decoding="async" fetchpriority="high" />

<link rel="preload" href="font.woff2" as="font" crossorigin />
<link rel="preconnect" href="https://api.example.com" />
```

## JavaScript en el navegador

### Event delegation

```javascript
document.querySelector("#list").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]")
  if (!btn) return
  const action = btn.dataset.action
  if (action === "delete") deleteItem(btn.dataset.id)
})
```

Un solo listener en vez de N. Esencial para listas dinámicas.

### AbortController

```javascript
function search(query, { signal }) {
  const controller = new AbortController()
  signal?.addEventListener("abort", () => controller.abort())

  return fetch(`/api/search?q=${query}`, {
    signal: controller.signal
  })
}

// Uso: cancela fetch previo si el usuario escribe más
let controller
input.addEventListener("input", () => {
  controller?.abort()
  controller = new AbortController()
  search(input.value, { signal: controller.signal })
})
```

### Web Workers — offload de cómputo

```javascript
// main.js
const worker = new Worker("hash.worker.js", { type: "module" })
worker.postMessage(fileBuffer)
worker.onmessage = (e) => console.log("Hash:", e.data)

// hash.worker.js
self.onmessage = async (e) => {
  const hash = await crypto.subtle.digest("SHA-256", e.data)
  self.postMessage(hash)
}
```

## Seguridad frontend

- **CSP**: `Content-Security-Policy: script-src 'self'` bloquea XSS por inyección inline.
- **Trusted Types**: Previene `innerHTML` como string. Solo permite a través de un policy.
- **DOMPurify**: Sanitiza HTML desconocido. Úsalo antes de `innerHTML` si es inevitable.
- **Sandbox iframe**: `<iframe sandbox="allow-scripts">` — sin formularios, sin navegación, sin plugins.

## Ejemplo completo: buscador progresivo

```html
<form role="search" id="search-form">
  <label for="q">Buscar:</label>
  <input type="search" id="q" name="q" autocomplete="off" />
  <ul id="results" role="listbox" aria-live="polite"></ul>
</form>
```

```css
#results:empty { display: none; }
#results li { padding: 0.5em; cursor: pointer; }
#results li[aria-selected="true"] { background: highlight; }
```

```javascript
const input = document.querySelector("#q")
const results = document.querySelector("#results")
let controller, selectedIndex = -1

input.addEventListener("input", async () => {
  controller?.abort()
  controller = new AbortController()
  selectedIndex = -1

  if (input.value.length < 2) { results.innerHTML = ""; return }

  const res = await fetch(`/api/search?q=${input.value}`, {
    signal: controller.signal
  })
  const data = await res.json()
  results.innerHTML = data.map(r => `<li role="option">${r.title}</li>`).join("")
})

input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault()
    const items = results.querySelectorAll("li")
    items[selectedIndex]?.removeAttribute("aria-selected")
    selectedIndex = (selectedIndex + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
    items[selectedIndex]?.setAttribute("aria-selected", "true")
  }
})
```

Sin framework. Accesible. Rendimiento nativo. La web platform es poderosa por sí sola. Domínala antes de delegar en abstracciones.
