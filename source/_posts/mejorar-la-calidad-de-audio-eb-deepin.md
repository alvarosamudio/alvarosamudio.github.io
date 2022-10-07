---
title: Mejorar la calidad de audio en deepin
---
Una de las cosas que son notables en las distribuciones GNU/Linux es que el audio es distinto al de Windows, y esto tiene que ver con la calidad, ecualizacion y potencia, y hoy en este tutorial, mejoraremos la calidad del audio

Vamos a editar el archivo daemon.conf de PulseAudio

```bash
$ sudo nano /etc/pulse/daemon.conf
```

Ajustamos 3 parámetros en principio

Y como vas a ver en el ejemplo, copie las líneas por si hay que volver atrás, le ajuste los parámetros y las descámente sacando el;

```bash
resample-method = src-sinc-best-quality

default-sample-format = s24le

default-sample-rate = 96000
```

Una vez que cambiamos esto, le damos F2 con nano para guardar y salir, y reiniciamos PulseAudio:

```bash
$ sudo pulseaudio -k
```

```bash
$ sudo pulseaudio --start
```
