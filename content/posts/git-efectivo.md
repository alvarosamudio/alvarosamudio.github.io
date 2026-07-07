---
title: Cómo usar Git de manera efectiva
date: 2026-05-03
tags: [git, control-de-versiones, productividad]
categories: [desarrollo, herramientas]
---

Git no es solo `add`, `commit`, `push`. Su modelo de objetos interno — blobs, trees, commits, tags — es un grafo acíclico dirigido (DAG) que, cuando lo entiendes, te da control total sobre el historial de tu proyecto. Aquí no cubro lo básico; cubro lo que marca la diferencia entre "usar Git" y "dominar Git".

## El modelo de objetos de Git

Git es un sistema de archivos direccionable por contenido. Cada objeto tiene un hash SHA-1 que depende de su contenido:

| Objeto | Qué almacena | Ejemplo |
|--------|-------------|---------|
| Blob | Contenido de archivo | `git hash-object archivo.txt` |
| Tree | Lista de blobs + otros trees (directorios) | `git ls-tree HEAD` |
| Commit | Snapshot del árbol + padre + mensaje + autor | `git cat-file -p HEAD` |
| Tag | Referencia a un commit (anotado o ligero) | `git show v1.0` |

```bash
# Ver el árbol del commit actual
$ git cat-file -p HEAD^{tree}

# Ver qué archivos componen ese árbol
$ git ls-tree HEAD

# Ver el tipo de cualquier objeto por su hash
$ git cat-file -t a1b2c3d
```

## Reflog — tu red de seguridad

Cada acción en Git queda registrada en el reflog local durante 90 días:

```bash
$ git reflog
# a1b2c3d HEAD@{0}: commit: fix: login validation
# e4f5g6h HEAD@{1}: reset: moving to HEAD~1
# i7j8k9l HEAD@{2}: commit: wip: refactoring auth

# Recuperar un commit "perdido" después de un reset
$ git reset --hard HEAD@{2}
# o por hash
$ git checkout a1b2c3d
```

Sin reflog, un `git reset --hard` equivocado sería desastre. Con reflog, es solo un paso atrás.

## Interactive rebase — historia limpia

```bash
$ git rebase -i HEAD~5
```

Esto abre un editor donde puedes reordenar, fusionar (squash), editar, o eliminar commits. Los comandos clave:

```
pick a1b2c3 feat: add login form
squash d4e5f6 fix: typo in login form   → se fusiona con el anterior
reword g7h8i9 chore: update deps        → permite editar mensaje
edit j0k1l2 refactor: extract validator → pausa para dividir en más commits
drop m3n4o5 temp: debug output          → elimina el commit
```

Nunca hagas rebase en ramas compartidas (main, develop) — solo en ramas locales o feature branches.

## Git bisect — cazando bugs en el historial

```bash
$ git bisect start
$ git bisect bad          # commit actual tiene el bug
$ git bisect good v1.0    # esta versión funcionaba

# Git hace checkout binario hasta encontrar el commit culpable
# En cada paso: prueba y marca
$ git bisect good  # o bad
$ git bisect reset  # al terminar
```

Puedes automatizarlo:

```bash
$ git bisect run npm test
# Git ejecuta el comando en cada paso: 0 = good, 1 = bad
```

En un proyecto con 2000 commits, git bisect encuentra el culpable en ~11 pasos (log₂ 2000).

## Worktrees — múltiples ramas simultáneas

```bash
# Trabajar en una rama sin perder el estado actual
$ git worktree add ../project-feature feature-x
$ git worktree list

# Útil para: revisar PRs, hotfixes, o contextos paralelos
$ git worktree add -b hotfix/critical ../project-hotfix main
# Editas en ../project-hotfix mientras mantienes tu trabajo actual
```

Cada worktree es un checkout independiente que comparte el objeto store — no duplica el `.git`.

## Hooks — automatización local

Los hooks en `.git/hooks/` se ejecutan en eventos específicos:

```bash
#!/bin/sh
# .git/hooks/pre-commit — lint + test antes de cada commit
npm run lint
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ Lint o typecheck fallaron. Commit cancelado."
  exit 1
fi
```

Hooks útiles: `pre-commit` (lint/test), `prepare-commit-msg` (prefix automático), `pre-push` (test suite), `post-checkout` (instalar dependencias).

Para compartir hooks con el equipo, usa `core.hooksPath` y versionalos en `.githooks/`:

```bash
$ git config core.hooksPath .githooks
```

## Firmar commits con SSH

Desde Git 2.34, puedes firmar commits con SSH en vez de GPG:

```bash
$ git config --global gpg.format ssh
$ git config --global user.signingkey ~/.ssh/id_ed25519.pub
$ git commit -S -m "feat: audit trail"
```

Verificar firmas: `git log --show-signature`. La ventaja de SSH sobre GPG: ya tienes las llaves, no necesitas un keyring separado.

## Git merge strategies

```bash
# Estrategias de merge: ort (default desde Git 2.33) vs recursive vs ours
$ git merge -X theirs feature-x   # en conflicto, gana su versión
$ git merge -X ours feature-x     # en conflicto, gana mi versión

# Squash merge — fusiona todo en un solo commit
$ git merge --squash feature-x && git commit
```

| Estrategia | Cuándo usar |
|-----------|-------------|
| merge regular | Preservar historial completo, ramas compartidas |
| squash merge | Feature branches temporales, PRs que no necesitan cada commit individual |
| rebase | Historia lineal, ramas locales, antes de abrir PR |
| cherry-pick | Portar commits específicos entre ramas |

## Git para forensia

```bash
# Quién modificó cada línea de un archivo
$ git blame --date=short src/lib/auth.ts

# Buscar cuándo se introdujo (o eliminó) una string específica
$ git log -S "SECRET_KEY" -- "*.ts"
$ git log -G "password" -- "*.{ts,js}"

# Buscar por contenido en mensajes de commit
$ git log --all --grep="security"
```

Estos comandos son esenciales para auditoría de seguridad y análisis de regresiones. Combinados con `git bisect`, son el equivalente forense de Git.

## Buenas prácticas consolidadas

- **Commits atómicos**: cada commit es un cambio lógico único. Si necesitas describirlo con "y", deberían ser dos commits.
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:` son prefijos que permiten generar changelogs automáticos.
- **Branch naming**: `feat/login-form`, `fix/auth-null`, `chore/deps-2026`.
- **Pull con rebase**: `git pull --rebase` evita merge commits innecesarios. Configúralo por defecto: `git config --global pull.rebase true`.
- **.gitattributes**: define normalización de line endings, detecta archivos binarios, asigna diff drivers para archivos específicos:

```text
*.ts diff=typescript linguist-language=TypeScript
*.svg -diff binary
* text=auto eol=lf
```

Domina estos patrones y Git pasa de ser un "sistema de backup" a ser una herramienta quirúrgica para navegar y manipular el historial de tu proyecto.
