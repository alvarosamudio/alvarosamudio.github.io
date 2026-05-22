---
title: Introducción a Docker para desarrolladores
date: 2026-05-01
tags: [docker, contenedores, devops]
categories: [desarrollo, herramientas]
---

Docker se ha convertido en una herramienta esencial para el desarrollo de software moderno. Permite empaquetar aplicaciones con todas sus dependencias en contenedores ligeros y portátiles.

## ¿Qué es Docker?

Docker es una plataforma de contenedorización que permite ejecutar aplicaciones de forma aislada del sistema anfitrión. A diferencia de las máquinas virtuales, los contenedores comparten el kernel del sistema operativo, lo que los hace mucho más eficientes.

## Conceptos clave

- **Imagen**: Plantilla de solo lectura con instrucciones para crear un contenedor
- **Contenedor**: Instancia ejecutable de una imagen
- **Dockerfile**: Archivo de texto con las instrucciones para construir una imagen
- **Volumen**: Mecanismo para persistir datos generados por contenedores

## Instalación

En distribuciones basadas en Debian/Ubuntu:

```bash
$ sudo apt update
$ sudo apt install docker.io
$ sudo systemctl start docker
$ sudo systemctl enable docker
```

## Tu primer contenedor

```bash
$ docker run hello-world
```

Este comando descarga y ejecuta una imagen de prueba que verifica que Docker funciona correctamente.

## Ejemplo práctico: servidor web simple

Crea un archivo `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY ./sitio-web /usr/share/nginx/html
EXPOSE 80
```

Construye y ejecuta:

```bash
$ docker build -t mi-sitio .
$ docker run -d -p 8080:80 mi-sitio
```

Ahora puedes acceder a `http://localhost:8080` para ver tu sitio web.

Docker simplifica enormemente el despliegue y la colaboración en equipos de desarrollo.
