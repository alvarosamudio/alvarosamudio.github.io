---
title: Introducción a Docker para desarrolladores
date: 2026-05-01
tags: [docker, contenedores, devops]
categories: [desarrollo, herramientas]
---

Docker no es "una máquina virtual ligera". Los contenedores son procesos aislados que comparten el kernel del host, no virtualizan hardware. Esta diferencia fundamental determina todo: rendimiento, seguridad, y modelo de despliegue.

## El aislamiento — namespaces y cgroups

Un contenedor no es más que un proceso Linux con aislamiento de recursos:

| Namespace | Aísla | Lo que significa |
|-----------|-------|------------------|
| PID | IDs de proceso | El proceso 1 dentro del contenedor no ve procesos del host |
| Network | Interfaces de red | `localhost` dentro del contenedor es SU localhost |
| Mount | Sistema de archivos | El contenedor ve su propio `/`, no el del host |
| User | UIDs/GIDs | root dentro del contenedor puede ser no-root fuera |
| UTS | Hostname | `hostname` dentro del contenedor es diferente |
| IPC | Comunicación entre procesos | Señales y semáforos aislados |

Los **cgroups** limitan recursos:

```bash
$ docker run --memory="512m" --cpus="2.0" --memory-swap="1g" nginx
$ docker stats  # ver uso de recursos en tiempo real
```

Sin `--memory-swap`, el contenedor puede usar swap sin límite. Sin `--cpus`, un proceso puede consumir todos los núcleos del host.

## El sistema de archivos en capas

Cada `RUN`, `COPY`, `ADD` en un Dockerfile crea una capa de solo lectura. Cuando ejecutas un contenedor, Docker añade una capa de escritura temporal (Copy-on-Write):

```dockerfile
FROM node:22-alpine AS builder        # capa 1: ~130 MB
WORKDIR /app                          # capa 2: metadatos
COPY package*.json ./                 # capa 3: ~100 KB
RUN npm ci --production               # capa 4: ~50 MB
COPY . .                              # capa 5: ~1-10 MB
RUN npm run build                     # capa 6: output de build

FROM node:22-alpine AS production     # capa 7: nueva base
COPY --from=builder /app/dist ./dist  # capa 8: solo los artefactos
COPY --from=builder /app/node_modules ./node_modules  # capa 9
CMD ["node", "dist/index.js"]         # capa 10: metadatos
```

Multi-stage builds: la imagen final solo contiene `dist/` y `node_modules/`, no las herramientas de build (TypeScript, esbuild, webpack). La imagen final baja de ~1.2 GB a ~180 MB.

## Docker Compose — infraestructura como código local

```yaml
# compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
    volumes:
      - .:/app
      - /app/node_modules  # volumen anónimo para no sobreescribir node_modules
    develop:
      watch:
        - action: sync+restart
          path: ./src
          target: /app/src

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  pgdata:
  redis_data:
```

`docker compose watch` (Docker Compose v2.30+) reemplaza herramientas externas de hot-reload. Escucha cambios en `./src` y sincroniza automáticamente.

## Redes — cómo se comunican los contenedores

```bash
$ docker network create app-net

$ docker run --network app-net --name api my-api
$ docker run --network app-net --name web my-web

# Desde web, puedes acceder a api por nombre
$ curl http://api:3000/health
```

| Modo de red | Comportamiento | Cuándo usarlo |
|-------------|---------------|---------------|
| bridge (default) | Red privada por host, NAT para salida | Contenedores locales que necesitan comunicarse |
| host | Comparte la red del host, sin aislamiento | Proxy inverso (Traefik), monitoreo |
| overlay | Red multi-host (Swarm) | Clúster distribuido |
| none | Sin red | Contenedores de procesamiento batch, aislamiento total |

## Volúmenes — persistencia correcta

```bash
# Bind mount — monta un directorio del host. Útil para dev, no para producción
$ docker run -v $(pwd)/data:/app/data app

# Named volume — gestionado por Docker, portátil entre hosts
$ docker volume create app-data
$ docker run -v app-data:/app/data app

# tmpfs — en memoria, se pierde al parar. Útil para secretos temporales
$ docker run --tmpfs /tmp:rw,noexec,nosuid,size=64m app
```

En producción, prefiere named volumes sobre bind mounts. Los bind mounts dependen de la estructura de directorios del host y no son portátiles.

## Seguridad en contenedores

```dockerfile
FROM node:22-alpine

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --chown=app:app dist/ /app/
ENTRYPOINT ["/app/entrypoint.sh"]
```

Nunca ejecutes contenedores como root en producción. Un atacante que comprometa el proceso `root` dentro del contenedor tiene acceso a todas las syscalls del kernel. Con `USER app`, el daño se limita a lo que el UID no-root puede hacer.

```bash
# Ejecutar con solo las syscalls necesarias
$ docker run --security-opt seccomp=chrome.json app

# Sistema de archivos de solo lectura
$ docker run --read-only --tmpfs /tmp app

# Sin privilegios extra
$ docker run --cap-drop ALL --cap-add NET_BIND_SERVICE app
```

## Docker en 2026 — el panorama

Docker Compose sigue siendo el estándar para desarrollo local, pero el panorama de producción cambió:

| Herramienta | Rol | Docker compatible |
|-------------|-----|------------------|
| Docker + Swarm | Orquestación simple, equipos pequeños | ✅ |
| Kubernetes | Orquestación compleja, equipos grandes | ✅ (cri-dockerd) |
| Podman | Docker sin daemon, rootless por defecto | ✅ (alias docker=podman) |
| containerd | Low-level runtime estándar | ✅ (OCI spec) |
| Finch/Colima | Docker en macOS sin Docker Desktop | Alternativas a Docker Desktop |

Para desarrollo local, Docker Desktop (o una alternativa como Colima) + Compose sigue siendo la opción más productiva. Para producción, Kubernetes es el estándar de facto.

Docker no es magia — es aislamiento de procesos bien diseñado. Cuando entiendes namespaces, cgroups, y el modelo de capas, diagnosticar problemas de contenedores pasa de "reiniciar y rezar" a "analizar y resolver".
