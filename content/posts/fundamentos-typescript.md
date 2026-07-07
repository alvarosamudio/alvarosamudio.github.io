---
title: Fundamentos de TypeScript
date: 2026-05-05
tags: [typescript, javascript, tipado]
categories: [desarrollo, lenguajes]
---

TypeScript no es solo "JavaScript con tipos". Es un lenguaje de tipos Turing completo que te permite codificar invariantes del dominio en tiempo de compilación. Cuando dominas su sistema de tipos, los bugs que llegaban a producción se convierten en errores de compilación.

## Más allá de los tipos básicos

El sistema de tipos de TypeScript es estructural (duck typing), no nominal como Java o C#. Dos objetos con la misma forma son del mismo tipo, aunque no tengan una interfaz compartida:

```typescript
interface Point { x: number; y: number }
interface Coordinate { x: number; y: number }

const p: Point = { x: 1, y: 2 }
const c: Coordinate = p  // ✅ compatible estructuralmente
```

### Tipos condicionales

Permiten elegir un tipo basado en una condición. Son el equivalente a un ternario en el nivel de tipos:

```typescript
type IsString<T> = T extends string ? "sí" : "no"

type A = IsString<"hola">   // "sí"
type B = IsString<42>       // "no"
```

### Template literal types

Transforman strings en el sistema de tipos. Útiles para eventos, rutas, o builders:

```typescript
type EventName = `on${Capitalize<string>}`
type Route = `/api/${string}/:id`

type ApiRoute = `/api/${"users" | "posts"}/${number}`
// "/api/users/42" ✅
// "/api/posts/7"  ✅
// "/api/mal/xyz"  ❌
```

### Mapped types con `as`

Puedes re-mapear claves de un objeto:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

type User = { name: string; age: number }
type UserGetters = Getters<User>
// { getName: () => string; getAge: () => number }
```

## Uniones discriminadas como máquinas de estado

Es el patrón más poderoso de TypeScript. Modela cada estado como una variante con un discriminante común (`type` o `kind`):

```typescript
type ApiState<T> =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; data: T; timestamp: number }
  | { type: "error"; error: Error; code: number; retry: boolean }

function handleState<T>(state: ApiState<T>) {
  switch (state.type) {
    case "idle":
      return "Esperando..."
    case "loading":
      return "Cargando..."
    case "success":
      return `Datos: ${state.data} (${new Date(state.timestamp).toISOString()})`
    case "error":
      if (state.retry) return `Reintentando: ${state.error.message}`
      return `Error [${state.code}]: ${state.error.message}`
  }
}
```

El `switch` exhaustivo se asegura con `never`:

```typescript
function assertNever(x: never): never {
  throw new Error(`Estado no manejado: ${x}`)
}

function handleState<T>(state: ApiState<T>, ctx: Context) {
  switch (state.type) { /* ... */ }
  default: assertNever(state) // error si falta un case
}
```

## El operador `satisfies`

Introducido en TS 4.9, valida que un tipo cumpla una forma SIN cambiar su tipo inferido:

```typescript
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Record<string, string | number[]>

palette.red.map(x => x) // ✅ infiere number[], no string | number[]
```

Sin `satisfies`, `palette.red` sería `string | number[]` y no podrías usar `.map()` sin type guard.

## Genéricos avanzados

### `infer` en condicionales

Extrae un tipo desde una estructura mayor:

```typescript
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never

type Fn = (x: string) => number
type R = ReturnTypeOf<Fn> // number
```

### Utility types reales

Un `deepPartial` que recorre recursivamente:

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
      ? DeepPartial<T[P]>
      : T[P]
}
```

## El tsconfig que necesitas

Estas flags atrapan bugs reales que `any` y `null` dejan pasar:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "isolatedDeclarations": true
  }
}
```

- `noUncheckedIndexedAccess`: cada acceso a `arr[i]` retorna `T | undefined` — te obliga a manejar el `undefined`.
- `exactOptionalPropertyTypes`: `prop?: string` permite `undefined` pero no te deja asignar `undefined` a una propiedad requerida.
- `isolatedDeclarations`: necesario para compatibilidad con bundlers que transpilan archivo por archivo.

## Branded types — tipado nominal en sistema estructural

```typescript
type UserId = string & { readonly __brand: "UserId" }
type OrderId = string & { readonly __brand: "OrderId" }

function getUser(id: UserId): User { /* ... */ }
function getOrder(id: OrderId): Order { /* ... */ }

const uid = "abc123" as UserId
getUser(uid)     // ✅
getOrder(uid)    // ❌ tipo incorrecto
```

Sin esto, `string` es `string` y las IDs se mezclan. Una fuente frecuente de bugs en producción.

## Errores comunes

- **`any` leakage**: una función que recibe `any` infecta todo el grafo de tipos. Siempre usa `unknown` si el tipo es incierto.
- **`as` assertion**: `as` desactiva el type checker. Es una bomba de tiempo. Prefiere `satisfies` o type guards.
- **Enums**: prefiero uniones de strings literales. Los enums numéricos de TypeScript generan código IIFE y rompen la tree-shaking.
- **Seguridad**: TypeScript + template strings no sanitiza SQL. `"SELECT * FROM users WHERE id = '${input}'"` sigue siendo SQL injection aunque el resto del proyecto esté tipado.

TypeScript bien usado no es overhead — es un multiplicador de fuerza. Cuando escalas de "tipos como anotaciones" a "tipos como diseño", el código se escribe solo.
