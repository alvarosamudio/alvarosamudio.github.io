---
title: "Desarrollo web: HTML, CSS y JavaScript"
date: 2026-05-19
tags: [html, css, javascript, frontend, web]
categories: [desarrollo, web, tutoriales]
---

HTML, CSS y JavaScript son los pilares del desarrollo web. Dominarlos te permite construir cualquier cosa en la web.

## HTML: La estructura

HTML define el contenido y la estructura de una página web.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mi página</title>
</head>
<body>
  <header>
    <h1>Bienvenido</h1>
  </header>
  <main>
    <p>Contenido principal</p>
  </main>
</body>
</html>
```

## CSS: El estilo

CSS controla la apariencia visual. Con las nuevas características como Container Queries y la pseudoclase `:has()`, el diseño web es más poderoso que nunca:

```css
.card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  container-type: inline-size;
}

.card:has(img) {
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

## JavaScript: La interacción

JavaScript añade comportamiento dinámico:

```javascript
document.querySelector("button").addEventListener("click", async () => {
  const respuesta = await fetch("/api/datos");
  const datos = await respuesta.json();
  console.log(datos);
});
```

## Buenas prácticas

- **Semántica HTML**: Usa etiquetas con significado (`<article>`, `<nav>`, `<aside>`)
- **CSS moderno**: Flexbox y Grid para maquetación, variables CSS para temas
- **JS progresivo**: Mejora la experiencia sin depender completamente de JavaScript

Estas tres tecnologías, bien aprendidas, son la base de todo el desarrollo web moderno.
