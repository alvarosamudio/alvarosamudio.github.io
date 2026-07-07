---
title: "Mejorar la calidad de audio en deepin"
date: 2026-04-29
tags: [linux, audio, pulseaudio, pipewire]
categories: [sistemas-operativos, tutoriales]
---

La calidad de audio en Linux no es inherentemente inferior a Windows o macOS — la diferencia está en la configuración por defecto de la cadena de audio. Mientras que Windows usa WASAPI Shared Mode con remuestreo automático a la mejor calidad, PulseAudio y PipeWire vienen configurados para bajo consumo de CPU, no para fidelidad. Este tutorial explica cómo optimizar cada capa.

## La cadena de audio en Linux

```
Aplicación → ALSA (driver) → PulseAudio/PipeWire → Tarjeta de sonido
```

Cada etapa puede degradar la calidad:
- **Remuestreo**: convertir frecuencias de muestreo (ej: 44100 Hz → 48000 Hz)
- **Formato de muestra**: reducir profundidad (ej: 24 bits enteros → 16 bits)
- **Mezcla**: combinar múltiples fuentes con pérdida de precisión

## PipeWire — el sucesor de PulseAudio

Desde 2024, la mayoría de distribuciones (incluyendo deepin) migraron de PulseAudio a PipeWire. PipeWire maneja tanto audio como video con latencia menor y mejor calidad de remuestreo.

```bash
# Verificar si estás usando PipeWire o PulseAudio
$ pactl info | grep "Server Name"
# PulseAudio (configuración nativa): "pulseaudio"
# PipeWire (emulación Pulse): "PipeWire"

# Si usas PipeWire, el archivo de configuración es:
$ nano /etc/pipewire/pipewire.conf
```

No es necesario instalar nada nuevo — deepin 23+ usa PipeWire por defecto. Si estás en una versión anterior, migrar a PipeWire es recomendable solo por calidad de audio.

### Parámetros críticos en PipeWire

```ini
# /etc/pipewire/pipewire.conf — sección de audio
default.clock.rate          = 96000
default.clock.allowed-rates = [ 44100 48000 96000 192000 ]
default.clock.quantum       = 256
default.clock.min-quantum   = 32
default.clock.max-quantum   = 8192
```

- `default.clock.rate`: frecuencia de muestreo por defecto. 96000 Hz evita múltiples remuestreos.
- `allowed-rates`: las tarjetas modernas soportan múltiples frecuencias. PipeWire elige la mejor según la fuente.
- `quantum`: tamaño del buffer. Más pequeño = menor latencia, más CPU. 256 es un buen balance.

## Configuración avanzada de PulseAudio (si aplica)

Si tu sistema aún usa PulseAudio, edita:

```bash
$ nano /etc/pulse/daemon.conf
```

### Remuestreo — la mejora más audible

```ini
resample-method = speex-float-10
```

Alternativas ordenadas por calidad (de peor a mejor):

| Método | Calidad | CPU | Latencia |
|--------|---------|-----|----------|
| speex-float-0 | Mala | Baja | Baja |
| speex-float-10 | Buena | Media | Media |
| src-sinc-best-quality | Excelente | Alta | Alta |

Si tienes un procesador moderno, `src-sinc-best-quality` ofrece la mejor calidad (filtros sinc con ventana Kaiser). En CPUs más antiguos, `speex-float-10` es un buen compromiso.

### Formato de muestra y frecuencia

```ini
default-sample-format = s24le
default-sample-rate = 96000
default-sample-channels = 2
alternate-sample-rate = 44100
```

- `s24le`: 24 bits little-endian. La mayoría de DACs externos y tarjetas modernas soportan 24 bits nativamente. 16 bits (s16le) pierde rango dinámico.
- `96000 Hz`: evita el remuestreo de contenido que ya está a 96 kHz (audio HD, Tidal, Qobuz). Para contenido a 44.1 kHz, el remuestreo a 96 kHz introduce artefactos — por eso se define `alternate-sample-rate = 44100`.
- `avoid-resampling`: si configuras `avoid-resampling = true`, PulseAudio pasa la frecuencia original sin remuestrear cuando la tarjeta lo soporta. PipeWire hace esto por defecto.

### Aplicar cambios

```bash
# PulseAudio
$ pulseaudio -k
$ pulseaudio --start

# PipeWire
$ systemctl --user restart pipewire pipewire-pulse
```

Verificar que los cambios se aplicaron:

```bash
$ pactl list sinks | grep -E "Sample|Formats|Rate"
# Sample Specification: s24le 2ch 96000Hz
# Formatos: pcm, s24le-32le
```

## ALSA — configuración directa

Si usas aplicaciones que acceden ALSA directamente (como algunos reproductores de audio profesional), configura:

```bash
$ nano /etc/asound.conf
```

```ini
defaults.pcm.rate_converter "speexrate_medium"
defaults.pcm.format S24_LE
defaults.pcm.rate 96000
# Usar dmix para mezcla de software
pcm.!default {
  type plug
  slave.pcm "dmix:0"
}
```

## Ecualización con EasyEffects

PipeWire integra EasyEffects (antes PulseEffects), un ecualizador de sistema con procesamiento por canal:

```bash
$ sudo apt install easyeffects
```

Perfiles recomendados para auriculares:
- **AutoEQ**: repositorio con perfiles medidos científicamente para cientos de modelos de auriculares.
- **Bass Enhancing +10**: realza frecuencias bajas sin saturar.
- **Crystal Clear**: reduce sibilancia (6-8 kHz) y realza presencia (2-4 kHz).

```bash
# Aplicar perfil AutoEQ para tus auriculares
$ git clone https://github.com/jaakkopasanen/AutoEq.git
# Busca tu modelo, exporta el filtro y cárgalo en EasyEffects
```

## Verificación — ¿realmente mejoró?

```bash
# Prueba de frecuencia: audioprólogo o prueba sinusoidal
$ speaker-test -t sine -f 440    # 440 Hz (La4)
$ speaker-test -t sine -f 16000  # 16 kHz (prueba de agudos)

# Análisis espectral con sox
$ sox -n -t wav - synth 10 sine 440 sine 880 chorus 0.5 0.5 50 0.5 0.1 -2 |
  play - -q

# Verificar ruta de audio actual
$ pactl list sink-inputs | grep "Sample Specification"
```

Un cambio de s16le → s24le y de 44100 → 96000 es perceptible en equipos de audio de calidad media-alta. En auriculares Bluetooth o altavoces económicos, la diferencia es marginal — el cuello de botella está en el hardware, no en el software.
