---
title: "VS Code: atajos y extensiones esenciales"
date: 2026-05-09
tags: [vscode, editor, productividad, atajos]
categories: [herramientas, productividad]
---

Un IDE no es productivo por sí mismo — lo es cuando lo configuras para que se adapte a tu flujo. Visual Studio Code es el editor más popular porque su modelo de extensiones y configuración permite personalizar cada aspecto. Aquí cubro los patrones que separan a los que "usan VS Code" de los que lo dominan.

## Atajos — modo teclado completo

Los comandos esenciales que deberías memorizar:

### Navegación

| Atajo (macOS) | Atajo (Win/Linux) | Acción |
|--------------|-------------------|--------|
| `Cmd+P` | `Ctrl+P` | Navegación rápida a archivo |
| `Cmd+Shift+P` | `Ctrl+Shift+P` | Paleta de comandos |
| `Cmd+B` | `Ctrl+B` | Mostrar/ocultar barra lateral |
| `Cmd+J` | `Ctrl+J` | Mostrar/ocultar terminal |
| `Ctrl+-` | `Ctrl+-` | Navegar hacia atrás en el cursor |
| `Ctrl+Shift+-` | `Ctrl+Shift+-` | Navegar hacia adelante |

### Edición avanzada

| Atajo | Acción |
|-------|--------|
| `Cmd+D` repetido | Seleccionar múltiples ocurrencias de la misma palabra |
| `Cmd+Shift+L` | Seleccionar TODAS las ocurrencias a la vez |
| `Option+Shift+Up/Down` | Duplicar línea arriba/abajo |
| `Option+Click` | Insertar cursor en múltiples posiciones |
| `Cmd+Shift+K` | Eliminar línea completa |
| `Ctrl+Shift+K` (Win) | Eliminar línea completa |
| `Alt+Up/Down` | Mover línea |
| `Shift+Option+F` | Formatear documento |

### Refactorización

```bash
# Renombrar símbolo (seguro, entiende el scope)
F2

# Encontrar todas las referencias
Shift+F12

# Ver definición
Cmd+Click o F12

# Ir a implementación
Cmd+F12
```

## Multi-cursor — el superpoder

```typescript
// Ejemplo: quieres renombrar una propiedad en múltiples objetos
const users = [
  { name_alias: "Ana", age: 30 },
  { name_alias: "Bob", age: 25 },
  { name_alias: "Eva", age: 35 },
]

// 1. Selecciona "name_alias" (doble click)
// 2. Cmd+D repetido para seleccionar las 3 ocurrencias
// 3. Escribe "nombre" y los 3 cambian simultáneamente
```

Patrones de multi-cursor:
- `Option+Click`: inserta cursor en cada línea que tocas.
- `Cmd+Shift+L`: selecciona todas las ocurrencias de la palabra bajo el cursor.
- `Ctrl+Shift+Alt+Up/Down`: bloque de cursor vertical.

## Configuración — qué flags importan realmente

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono, 'Fira Code', 'Cascadia Code', monospace",
  "editor.fontLigatures": true,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.renderWhitespace": "boundary",
  "editor.minimap.enabled": false,
  "editor.stickyScroll.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.inlineSuggest.enabled": true,
  "workbench.colorTheme": "One Dark Pro",
  "terminal.integrated.fontSize": 13,
  "files.exclude": {
    "**/.next": true,
    "**/.svelte-kit": true,
    "**/node_modules": true,
    "**/dist": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/out": true,
    "**/dist": true
  }
}
```

- `stickyScroll`: muestra la función/clase actual en el scroll — no pierdes contexto al navegar archivos largos.
- `fontLigatures`: `!=` se muestra como `≠`, `=>` como `⇒`. Más legible, menos cansancio visual.
- `files.exclude` + `search.exclude`: mantiene node_modules y build outputs fuera de la búsqueda y el explorador.

## Snippets — tus propias plantillas

```json
{
  "Svelte 5 Component": {
    "scope": "svelte",
    "prefix": "sfc",
    "body": [
      "<script lang=\"ts\">",
      "  let { ${1} }: { ${1}: ${2} } = \\$props()",
      "</script>",
      "",
      "<${3:div}>${4}</${3:div}>",
      "",
      "<style>",
      "  ${5}",
      "</style>"
    ],
    "description": "Svelte 5 component"
  }
}
```

Guarda esto en `~/.config/Code/User/snippets/svelte.json` o usa el comando "Configure Snippets" desde la paleta de comandos.

## Extensiones — las que realmente importan

### Imprescindibles
- **ESLint** / **Biome**: linting + formatting en el editor.
- **GitLens**: blame, historial inline, exploración visual de ramas.
- **GitHub Copilot** / **Codeium**: autocompletado contextual. Copilot es mejor para lenguajes de tipado dinámico, Codeium para TypeScript/Go/Rust.
- **Error Lens**: muestra errores de diagnóstico inline, no solo en la línea de estado.

### Para SvelteKit
- **Svelte for VS Code**: resaltado de sintaxis, autocompletado, diagnóstico para `.svelte`.
- **Svelte5-Rune**: snippets de Svelte 5 runes.
- **Tailwind CSS IntelliSense**: autocompletado de clases, si usas Tailwind.

### Lenguajes específicos
- **YAML**: esquemas para `docker-compose.yml`, `kubernetes/*.yaml`.
- **Prettier**: formateo consistente. Combínalo con `formatOnSave`.
- **Pretty TypeScript Errors**: mensajes de error legibles en vez del desbordamiento de texto de TS.

## Tasks — automatización desde el editor

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build & Check",
      "dependsOn": ["lint", "typecheck"]
    },
    {
      "label": "lint",
      "type": "shell",
      "command": "npx eslint src/"
    },
    {
      "label": "typecheck",
      "type": "shell",
      "command": "npx svelte-check"
    }
  ]
}
```

`Cmd+Shift+B` (o `Ctrl+Shift+B`) ejecuta la tarea por defecto. Útil para check rápido sin salir del editor.

## Remote Development — desarrollo remoto nativo

```bash
# Conectar a un servidor remoto vía SSH
# VS Code Server se instala automáticamente
$ code --remote ssh-remote+server.dev /home/user/project

# Conectar a un contenedor
$ code --folder-uri vscode-remote://dev-container+my-project
```

Las extensiones Remote-SSH, Dev Containers y Tunnels permiten desarrollar en entornos remotos con la misma experiencia que local. El código corre en el remoto; la UI, en tu máquina.

## Profiles — contextos separados

Puedes crear perfiles para diferentes roles:

- **Frontend profile**: extensiones para Svelte/React/Tailwind, oculta archivos backend.
- **Backend profile**: extensiones para Go/Rust/Python, base de datos explorer.
- **DevOps profile**: YAML, Docker, Kubernetes, Terraform.

Comando: `Profiles: Create Profile` desde la paleta de comandos. Cada perfil tiene su propio conjunto de extensiones, configuraciones y snippets.

## CLI de VS Code

```bash
# Abrir archivos en el editor actual
$ code src/lib/constants.ts

# Diff de dos archivos
$ code --diff src/old.ts src/new.ts

# Abrir sin extensiones (modo seguro)
$ code --disable-extensions .

# Instalar extensiones desde terminal
$ code --install-extension svelte.svelte-vscode
```

`code` en la terminal es más rápido que navegar con el ratón para abrir archivos conocidos.

Un editor bien configurado no es un lujo — es una extensión de tu cerebro. Invierte tiempo en configurarlo y cada hora de código será más productiva.
