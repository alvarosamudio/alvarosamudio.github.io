---
title: Conceptos básicos de ciberseguridad
date: 2026-05-11
tags: [seguridad, ciberseguridad, privacidad]
categories: [seguridad, tutoriales]
---

La ciberseguridad no es un producto que compras — es un proceso de gestión de riesgos. Cada decisión técnica tiene implicaciones de seguridad, y entender los fundamentos te permite tomar decisiones informadas en lugar de depender de soluciones mágicas.

## La tríada CIA en el mundo real

Confidencialidad, Integridad, Disponibilidad no son conceptos académicos. Son propiedades medibles:

### Confidencialidad — que solo quien debe, vea

Se implementa con cifrado. Dos tipos:

```bash
# Cifrado en reposo: AES-256-GCM para archivos
$ openssl enc -aes-256-gcm -salt -pbkdf2 -iter 100000 -in secret.txt -out secret.enc
$ openssl enc -d -aes-256-gcm -pbkdf2 -iter 100000 -in secret.enc

# Cifrado en tránsito: TLS 1.3 (no negociable hacia atrás)
# Verificar TLS de un servidor
$ openssl s_client -connect example.com:443 -tls1_3
```

Nunca uses AES-ECB (filtra patrones), CBC sin HMAC (padding oracle attack), o TLS < 1.2.

### Integridad — que los datos no hayan sido alterados

```bash
# Checksum criptográfico con SHA-256
$ shasum -a 256 archivo.iso
# Verificar contra la suma publicada en el sitio oficial

# Firma digital con GPG
$ gpg --verify archivo.iso.sig archivo.iso
$ gpg --detach-sign --armor archivo.iso

# Integrity Measurement Architecture (IMA) en Linux
$ cat /sys/kernel/security/ima/ascii_runtime_measurements
```

El hash por sí solo no prueba integridad — quien modificó el archivo también puede recalcular el hash. La firma digital (hash cifrado con clave privada) es la que prueba que el hash no fue alterado.

### Disponibilidad — que esté accesible cuando se necesita

No es solo uptime del servidor. Es resistencia a DDoS, redundancia geográfica, y plan de recuperación ante desastres (RTO/RPO).

```bash
# Prueba de carga básica con hey
$ hey -n 10000 -c 100 https://api.example.com/health
# -n: solicitudes totales, -c: concurrencia

# Monitoreo de disponibilidad
$ curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health
```

RTO (Recovery Time Objective): cuánto tiempo puedes estar caído. RPO (Recovery Point Objective): cuántos datos puedes perder. Sin estas métricas, tu plan de recuperación es una ilusión.

## Modelado de amenazas — piensa como atacante

Antes de implementar seguridad, pregúntate:

1. **¿Qué estoy protegiendo?** (datos, infraestructura, reputación)
2. **¿Contra quién?** (script kiddies, hacktivistas, estado-nación, empleado malicioso)
3. **¿Cuál es el vector de ataque más probable?** (phishing > exploit de 0-day > ataque físico)
4. **¿Cuál es el daño si fallo?** (económico, legal, operacional)

Usa el framework STRIDE para clasificar amenazas:

| Amenaza | Qué viola | Ejemplo |
|---------|-----------|---------|
| Spoofing | Autenticación | Email falso del CEO pidiendo transferencia |
| Tampering | Integridad | Modificar balance bancario en tránsito |
| Repudiation | No-repudio | Usuario niega haber hecho una compra |
| Information Disclosure | Confidencialidad | Filtración de base de datos |
| Denial of Service | Disponibilidad | DDoS que tumba el sitio |
| Elevation of Privilege | Autorización | Usuario normal escala a admin |

## Vulnerabilidades comunes — cómo explotarlas y defenderte

### XSS (Cross-Site Scripting)

```javascript
// ❌ Vulnerable: inserta HTML sin sanitizar
element.innerHTML = userInput

// ✅ Seguro: solo texto, no ejecuta scripts
element.textContent = userInput

// ✅ Trusted Types: solo permite innerHTML a través de un policy
const policy = trustedTypes.createPolicy("default", {
  createHTML: (input) => DOMPurify.sanitize(input)
})
```

Tipos: Stored (persistente en DB), Reflected (en URL), DOM-based (solo cliente). CSP con `script-src 'self'` bloquea XSS inline.

### SQL Injection

```javascript
// ❌ Concatenación directa — SQL injection clásica
db.query(`SELECT * FROM users WHERE id = '${req.params.id}'`)

// ✅ Prepared statement — la ÚNICA defensa
db.query("SELECT * FROM users WHERE id = $1", [req.params.id])
```

Blind SQL injection: cuando no ves el resultado de la query. Se extraen datos bit a bit mediante respuestas verdadero/falso o tiempo de respuesta.

### CSRF (Cross-Site Request Forgery)

```html
<!-- ❌ Sin protección: cualquier sitio puede hacer que tu usuario envíe esta petición -->
<img src="https://bank.com/transfer?amount=1000&to=attacker" />
```

Defensa: SameSite cookies (`SameSite=Strict` o `Lax`), tokens CSRF, doble envío de cookie. En 2026, SameSite=Strict está activado por defecto en todos los navegadores modernos.

### SSRF (Server-Side Request Forgery)

```javascript
// ❌ El servidor hace peticiones a URLs arbitrarias
const response = await fetch(req.query.url)

// ✅ Allowlist de dominios permitidos + validación de IP
const allowed = ["api.internal.com", "api.github.com"]
const url = new URL(req.query.url)
if (!allowed.includes(url.hostname)) throw new Error("dominio no permitido")
// Además verifica que no sea IP interna: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
```

SSRF es la puerta de entrada a metadata de cloud providers (AWS: `http://169.254.169.254/latest/meta-data/`). Bloquear IPs privadas es obligatorio.

## Autenticación y autorización

### 2FA/TOTP

```typescript
// Implementación TOTP (Time-based One-Time Password)
import * as OTPAuth from "otpauth"

const secret = new OTPAuth.Secret({ size: 20 })
const totp = new OTPAuth.TOTP({
  issuer: "MiApp",
  label: "usuario@email.com",
  secret,
  algorithm: "SHA1",   // RFC 4226
  digits: 6,
  period: 30,
})

// Generar código (cada 30 segundos)
const token = totp.generate()

// Verificar
const isValid = totp.validate({ token })
```

Prefer TOTP sobre SMS para 2FA. SMS es interceptable (SS7 attacks, SIM swapping). Apps como Authy, 2FAS, o passkeys (WebAuthn) son más seguras.

### WebAuthn/passkeys

```javascript
// Crear credencial (registro)
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(serverChallenge),
    rp: { name: "MiApp", id: "example.com" },
    user: { id: new Uint8Array(userId), name: "usuario@email.com", displayName: "Usuario" },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
  }
})

// Autenticar
const assertion = await navigator.credentials.get({
  publicKey: {
    challenge: new Uint8Array(serverChallenge),
    allowCredentials: [{ id: credentialId, type: "public-key" }],
  }
})
```

Passkeys son resistentes a phishing (la autenticación está vinculada al origin del sitio). No hay secreto compartido — la clave privada nunca sale del dispositivo.

## Defensa en profundidad

Ninguna capa de seguridad es suficiente por sí sola. La defensa en profundidad apila capas independientes para que una falla no comprometa todo:

1. **Código seguro**: sin inyecciones, sin secrets hardcodeados, validación de entrada.
2. **Cifrado**: TLS 1.3 en tránsito, AES-256 en reposo, hashing de contraseñas (bcrypt/argon2).
3. **Autenticación**: 2FA, passkeys, sesiones con HTTP-only + Secure + SameSite.
4. **Red**: firewall (nftables/iptables), WAF, rate limiting, segmentación VLAN.
5. **Sistema**: SELinux/AppArmor, actualizaciones automáticas, mínimos privilegios.
6. **Monitoreo**: logs centralizados, detección de anomalías, alertas en tiempo real.
7. **Respuesta**: plan de incidentes documentado, backups offline, equipo de respuesta.

La seguridad no es un checkbox — es un proceso continuo. Lo que es seguro hoy puede no serlo mañana. Mantente actualizado, parchea rápido, y asume que te van a comprometer eventualmente — prepárate para detectarlo y responder cuando pase.
