---
title: Linux para principiantes
date: 2026-05-07
tags: [linux, terminal, comandos]
categories: [sistemas-operativos, tutoriales]
---

Linux es un sistema operativo de código abierto que impulsa la mayoría de servidores y dispositivos del mundo. Aquí tienes una guía para empezar.

## La terminal

La terminal es tu mejor aliada. Estos son los comandos esenciales:

```bash
$ ls           # lista archivos
$ cd carpeta   # cambia de directorio
$ pwd          # muestra la ruta actual
$ mkdir dir    # crea un directorio
$ rm archivo   # elimina un archivo
$ cp origen destino  # copia archivos
$ mv origen destino  # mueve o renombra
```

## Permisos

Cada archivo tiene tres niveles de permisos: usuario, grupo y otros.

```bash
$ chmod +x script.sh     # da permiso de ejecución
$ chmod 755 archivo      # permisos en notación octal
$ chown usuario:grupo archivo  # cambia propietario
```

## Procesos

```bash
$ ps aux        # lista procesos en ejecución
$ top           # monitor de procesos en tiempo real
$ kill PID      # termina un proceso
$ htop          # versión mejorada de top
```

## Gestión de paquetes

En distribuciones basadas en Debian/Ubuntu:

```bash
$ sudo apt update           # actualiza lista de paquetes
$ sudo apt install paquete  # instala un paquete
$ sudo apt remove paquete   # elimina un paquete
$ sudo apt upgrade          # actualiza el sistema
```

Linux te da control total sobre tu sistema. Cuanto más lo uses, más cómodo te sentirás.
