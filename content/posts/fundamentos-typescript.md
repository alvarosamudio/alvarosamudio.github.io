---
title: Fundamentos de TypeScript
date: 2026-05-05
tags: [typescript, javascript, tipado]
categories: [desarrollo, lenguajes]
---

TypeScript es un superconjunto de JavaScript que añade tipado estático opcional. Ayuda a detectar errores en tiempo de compilación y mejora la calidad del código.

## Tipos básicos

```typescript
let nombre: string = "Juan";
let edad: number = 30;
let activo: boolean = true;
let lista: string[] = ["a", "b", "c"];
let tupla: [string, number] = ["hola", 42];
```

## Interfaces

Las interfaces definen la estructura de los objetos:

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email?: string; // opcional
  readonly createdAt: Date;
}

const usuario: Usuario = {
  id: 1,
  nombre: "Ana",
  createdAt: new Date(),
};
```

## Tipos personalizados

```typescript
type Estado = "activo" | "inactivo" | "pendiente";
type Callback = (resultado: string) => void;

function procesar(estado: Estado, cb: Callback): void {
  cb(`Estado: ${estado}`);
}
```

## Genéricos

Los genéricos permiten crear componentes reutilizables:

```typescript
function primera<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = primera([1, 2, 3]); // tipo inferido: number
const str = primera(["a", "b"]); // tipo inferido: string
```

TypeScript no solo previene errores, sino que también mejora la experiencia de desarrollo con autocompletado y documentación en el editor.
