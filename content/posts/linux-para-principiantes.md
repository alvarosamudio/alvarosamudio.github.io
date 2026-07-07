---
title: Linux para principiantes
date: 2026-05-07
tags: [linux, terminal, comandos]
categories: [sistemas-operativos, tutoriales]
---

Linux no es "Windows con otro escritorio". Es un sistema operativo construido sobre la filosofía Unix: cada herramienta hace una cosa bien, y se comunican mediante texto. Cuando entiendes esto, la terminal deja de ser intimidante y se convierte en el entorno más productivo que existe.

## Filosofía Unix

Cada comando es un filtro. Toma entrada, transforma, produce salida. Los pipes (`|`) conectan la salida de uno con la entrada del siguiente:

```bash
# pipeline: lista procesos → filtra por node → cuenta líneas
$ ps aux | grep node | wc -l

# pipeline: logs → errores → IPs únicas → ordenadas
$ cat /var/log/auth.log | grep "Failed password" | awk '{print $11}' | sort -u
```

Este diseño componible permite construir herramientas complejas a partir de bloques simples.

## Jerarquía del sistema de archivos (FHS)

```
/          → Raíz. Todo cuelga de aquí.
/bin       → Binarios esenciales del sistema (ls, cp, mv)
/sbin      → Binarios de administración (fdisk, mkfs)
/etc       → Configuración del sistema (passwd, ssh/sshd_config, nginx/)
/var       → Datos variables (logs en /var/log, bases de datos en /var/lib)
/usr       → Programas de usuario (binarios, librerías, documentación)
/home      → Directorios de usuarios
/tmp       → Archivos temporales (se limpian en cada reinicio en la mayoría de distros)
/proc      → Sistema de archivos virtual con información de procesos y kernel
/sys       → Información de dispositivos y drivers
```

`/proc` y `/sys` no ocupan espacio en disco — son interfaces virtuales hacia el kernel.

## Redirección y descriptores de archivo

```bash
# stdout (1) → archivo
$ ls > output.txt

# stderr (2) → archivo (errores)
$ npm install 2> errors.log

# stdout + stderr → mismo archivo
$ node server.js &> server.log

# stdin desde archivo
$ sort < unsorted.txt

# pipe: stdout de un comando → stdin de otro
$ grep "error" app.log | cut -d: -f2 | sort | uniq -c | sort -rn | head -10
```

## Señales de proceso

```bash
$ kill -l  # lista todas las señales
```

| Señal | Número | Acción | Uso |
|-------|--------|--------|-----|
| SIGTERM | 15 | Terminación limpia | Parada por defecto (`kill PID`) |
| SIGKILL | 9 | Terminación forzada | No responde a SIGTERM (`kill -9 PID`) |
| SIGHUP | 1 | Recargar configuración | `kill -HUP PID` (nginx, systemd) |
| SIGINT | 2 | Interrupción (Ctrl+C) | Cancelar proceso en primer plano |
| SIGSTOP | 19 | Pausar proceso | No se puede ignorar |
| SIGCONT | 18 | Reanudar proceso | Continuar después de SIGSTOP |

SIGKILL no permite limpiar recursos — es el último recurso. Siempre prueba SIGTERM primero.

## systemd — el sistema de inicio moderno

```bash
# Ver estado de servicios
$ systemctl status nginx
$ systemctl list-units --type=service --state=running

# Gestionar servicios
$ systemctl enable --now postgresql   # activar e iniciar ahora
$ systemctl disable --now apache2     # desactivar y parar

# Ver logs de un servicio
$ journalctl -u docker.service --since "1 hour ago" --no-pager

# Ver logs en tiempo real
$ journalctl -u app.service -f

# Analizar tiempo de arranque
$ systemd-analyze
$ systemd-analyze blame
```

Los timers de systemd reemplazan cron:

```ini
# /etc/systemd/system/backup.timer
[Unit]
Description=Backup diario

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
$ systemctl enable --now backup.timer
$ systemctl list-timers
```

Ventajas sobre cron: logging integrado (journald), control de dependencias, ejecución después de suspensión (`Persistent=true`).

## Text processing pipeline

```bash
# Extraer IPs de un log de Apache que no sean locales
$ grep -oP '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' access.log \
  | grep -v '^127\.\|^10\.\|^172\.\(1[6-9]\|2[0-9]\|3[01]\)\.\|^192\.168\.' \
  | sort | uniq -c | sort -rn | head -20

# Reemplazar en múltiples archivos con sed
$ sed -i 's/old-api\.example\.com/new-api\.example\.com/g' src/**/*.ts

# Awk: procesamiento estructurado (como SQL en terminal)
$ awk '{print $1, $4, $7}' access.log | head
$ awk '$9 >= 500 {count++} END {print "5xx errors:", count}' access.log
```

## Permisos — más allá de chmod 755

```bash
# Permisos en octal: r=4, w=2, x=1
$ chmod 755 file   # rwxr-xr-x
$ chmod 644 file   # rw-r--r--
$ chmod 600 file   # rw-------

# Sticky bit — solo el dueño puede borrar archivos en el directorio
$ chmod +t /shared   # /tmp usa sticky bit

# SUID — ejecutar archivo como el dueño, no como quien lo ejecuta
$ chmod u+s /usr/bin/passwd  # passwd corre como root para modificar /etc/shadow

# ACLs — permisos granulares
$ setfacl -m u:alvaro:rwx /shared/project
$ setfacl -m g:devops:rx /shared/project
$ getfacl /shared/project
```

SUID es peligroso. Cada binario SUID en tu sistema es un potencial vector de escalada de privilegios. Revísalos con `find / -perm -4000`.

## Symlinks vs hard links

```bash
# Soft link (symlink) — referencia por nombre. Se rompe si mueves/borras el target
$ ln -s /usr/local/bin/node /usr/bin/node

# Hard link — mismo inodo, mismo contenido. Indistinguible del original
$ ln original.txt enlace.txt  # comparten el mismo inodo
$ ls -li original.txt enlace.txt  # mismo número de inodo
```

No puedes hacer hard links a directorios ni a través de sistemas de archivos.

## Red y diagnóstico

```bash
# ss reemplaza a netstat
$ ss -tulpn   # servicios escuchando (tcp, udp, listen, pid)
$ ss -st      # estadísticas de conexiones

# ip reemplaza a ifconfig
$ ip addr show
$ ip route show
$ ip link set eth0 down/up

# Diagnóstico de red
$ traceroute google.com   # ruta hasta el destino, hop por hop
$ mtr google.com          # traceroute continuo con estadísticas
$ nmap -sS -p 1-1000 10.0.0.1  # escaneo de puertos SYN
$ dig +short alvarosamudio.github.io  # consulta DNS directa
$ curl -w "@format.txt" -o /dev/null -s https://example.com  # timing de respuesta
```

## Gestión de discos

```bash
# Ver discos y particiones
$ lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE

# Ver uso de espacio
$ df -h
$ du -sh /var/log/* | sort -rh | head -10

# Montar/desmontar
$ mount /dev/sdb1 /mnt/data
$ umount /mnt/data

# fstab — montaje automático en arranque
$ cat /etc/fstab
UUID=abc123 / ext4 defaults 0 1
UUID=def456 /mnt/data ext4 defaults 0 2
```

El último campo de fstab: `0` no hace backup, `1` es root filesystem, `2` es otros filesystems. El penúltimo controla `fsck` al arrancar.

## Gestores de paquetes

| Distribución | Gestor | Formato | Ventaja |
|-------------|--------|---------|---------|
| Debian/Ubuntu | apt | .deb | Mayor cantidad de paquetes |
| Fedora/RHEL | dnf | .rpm | Paquetes más actualizados |
| Arch | pacman | .pkg.tar.zst | Rolling release, AUR |
| NixOS | nix | .drv | Reproducibilidad, config declarativa |

```bash
# apt avanzado
$ apt-cache search keyword     # buscar paquetes
$ apt-cache showpkg package    # ver dependencias
$ apt-mark hold package        # evitar que se actualice

# dnf
$ dnf history                  # historial de operaciones
$ dnf provides */command       # qué paquete provee un comando

# pacman
$ pacman -Qii package          # información detallada
$ pacman -Qdt                  # huérfanos (dependencias no necesitadas)
```

Linux te da control total. No es más difícil — es diferente. El tiempo invertido en aprender la terminal y el modelo Unix se amortiza exponencialmente a lo largo de tu carrera.
