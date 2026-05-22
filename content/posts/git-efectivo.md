---
title: Cómo usar Git de manera efectiva
date: 2026-05-03
tags: [git, control-de-versiones, productividad]
categories: [desarrollo, herramientas]
---

Git es el sistema de control de versiones más utilizado del mundo. Conocerlo bien puede transformar tu flujo de trabajo.

## Configuración inicial

```bash
$ git config --global user.name "Tu Nombre"
$ git config --global user.email "tu@email.com"
$ git config --global init.defaultBranch main
```

## Flujo de trabajo básico

El ciclo diario con Git se resume en estos pasos:

```bash
$ git add archivo.txt
$ git commit -m "Mensaje descriptivo"
$ git push origin main
```

## Ramas (branches) efectivas

Trabajar con ramas permite desarrollar funcionalidades sin afectar la rama principal:

```bash
$ git checkout -b feature/nueva-funcionalidad
$ git commit -m "Agrega nueva funcionalidad"
$ git checkout main
$ git merge feature/nueva-funcionalidad
```

## Buenas prácticas

- **Commits atómicos**: Cada commit debe representar un cambio lógico único
- **Mensajes claros**: Usa el imperativo y sé descriptivo
- **Commits frecuentes**: No acumules cambios grandes
- **Pull antes de push**: Siempre sincroniza con el remoto

```bash
$ git pull --rebase origin main
```

## Resolver conflictos

Cuando dos personas modifican el mismo archivo, Git muestra un conflicto:

```text
<<<<<<< HEAD
cambio local
=======
cambio remoto
>>>>>>> rama-remota
```

Edita el archivo para quedarte con la versión correcta, elimina los marcadores y haz commit.

Dominar Git te hace más productivo y seguro al trabajar en equipo.
