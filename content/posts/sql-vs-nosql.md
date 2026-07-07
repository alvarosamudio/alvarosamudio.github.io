---
title: "Bases de datos: SQL vs NoSQL"
date: 2026-05-15
tags: [bases-de-datos, sql, nosql, postgresql, mongodb]
categories: [desarrollo, bases-de-datos]
---

La pregunta SQL vs NoSQL está mal planteada. No es una guerra entre dos bandos — es un espectro de modelos de datos, cada uno óptimo para un conjunto diferente de restricciones. La pregunta correcta es: ¿qué forma tiene tu problema?

## SQL — PostgreSQL como laboratorio

### Normalización en la práctica

Las formas normales no son un dogma, son una herramienta para detectar anomalías de escritura:

- **1NF**: cada celda, un valor. Sin arrays ni JSON anidado. PostgreSQL viola esto con `JSONB` y `TEXT[]` intencionalmente.
- **2NF**: toda columna no clave depende de la clave completa. Rompes esto cuando tienes una tabla con clave compuesta y un campo que solo depende de una parte.
- **3NF/BCNF**: toda columna no clave depende solo de la clave, no de otra columna no clave.

```sql
-- Violación de 2NF: category_description depende solo de category_id, no de (order_id, product_id)
CREATE TABLE order_items (
  order_id INT, product_id INT,
  quantity INT, price DECIMAL,
  category_id INT, category_description TEXT,
  PRIMARY KEY (order_id, product_id)
);

-- Solución: normalizar categories en tabla separada
CREATE TABLE categories (
  id INT PRIMARY KEY, description TEXT
);
```

### Indexación estratégica

PostgreSQL tiene 4 tipos de índice principales:

| Índice | Uso óptimo | Cuándo no usarlo |
|--------|-----------|------------------|
| B-tree | Igualdad, rangos, ORDER BY, LIKE 'foo%' | LIKE '%foo', JSONB, arrays |
| GIN | Arrays, JSONB, full-text search, trigramas | Columnas con pocos valores únicos |
| GiST | Geometría, búsqueda por rango, trigramas (pg_trgm) | Consultas de igualdad exacta |
| BRIN | Tablas muy grandes con orden físico correlacionado | Datos aleatorios sin orden |

```sql
-- Índice parcial: solo indexa lo que realmente consultas
CREATE INDEX idx_orders_active ON orders (created_at)
  WHERE status = 'pending';

-- Índice cubriente (covering index): evita acceder a la tabla
CREATE INDEX idx_users_email_cover ON users (email) INCLUDE (name, avatar_url);
```

`EXPLAIN ANALYZE` te muestra si PostgreSQL está usando tus índices:

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'pending' AND created_at > NOW() - INTERVAL '7 days';
```

### Ventanas y CTEs — SQL de nivel superior

```sql
-- Window function: ranking sin auto-join
SELECT
  student_id, course_id, score,
  RANK() OVER (PARTITION BY course_id ORDER BY score DESC) as position,
  AVG(score) OVER (PARTITION BY course_id) as avg_score
FROM enrollments;

-- CTE recursiva para árboles (categorías, organigramas, comentarios)
WITH RECURSIVE tree AS (
  SELECT id, name, parent_id, 1 as depth
  FROM categories WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id, c.name, c.parent_id, t.depth + 1
  FROM categories c JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree ORDER BY depth, name;
```

### JSONB en PostgreSQL

Cuando necesitas esquema flexible dentro de lo relacional:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_payload ON events USING GIN (payload jsonb_path_ops);

-- Consultar dentro de JSONB
SELECT * FROM events
WHERE payload @> '{"severity": "critical", "source": "auth"}';
```

El `jsonb_path_ops` acelera consultas de contención (`@>`) a costa de no soportar otros operadores. El `GIN` default soporta todos (`?`, `?|`, `?&`, `@>`).

## NoSQL por modelo

### Documentos — MongoDB

```javascript
// Aggregation pipeline — el equivalente a GROUP BY + JOIN + FILTER
db.orders.aggregate([
  { $match: { status: "completed", date: { $gte: ISODate("2026-01-01") } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.category", total: { $sum: "$items.price" }, count: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $lookup: { from: "categories", localField: "_id", foreignField: "code", as: "category" } }
])
```

Patrones de esquema para documentos:
- **Bucket**: agrupa datos de tiempo en buckets (por hora/día) para reducir documentos.
- **Polymorphic**: un campo `type` discrimina la estructura del documento.
- **Computed**: precalcula agregados al momento de escritura.
- **Approximation**: usa contadores aproximados (como hiperloglog) cuando la precisión exacta no importa.

Anti-patrón: usar `$lookup` para todo. Si necesitas joins frecuentes, estás usando la DB equivocada — el modelo documental brilla por inclusión, no por referencia.

### Clave-valor — Redis

Redis no es solo caché. Sus estructuras de datos nativas permiten patrones poderosos:

```javascript
// Streams — message queue durable
XADD logs:auth * user_id "123" action "login" ip "10.0.0.1"
XREAD COUNT 10 BLOCK 5000 STREAMS logs:auth 0

// Sorted sets — leaderboards en tiempo real
ZADD leaderboard:2026 1500 "user:1" 2000 "user:2"
ZREVRANGE leaderboard:2026 0 9 WITHSCORES
```

Persistencia: RDB (snapshot periódico) vs AOF (write-ahead log). AOF es más durable pero más lento. La configuración típica es RDB cada 5 minutos + AOF cada segundo.

### Wide-column — Cassandra

Cassandra modela alrededor de las queries, no de las entidades:

```cql
CREATE TABLE user_timeline (
  user_id UUID,
  post_time TIMESTAMP,
  post_id UUID,
  content TEXT,
  PRIMARY KEY (user_id, post_time, post_id)
) WITH CLUSTERING ORDER BY (post_time DESC);

-- Esta query es eficiente porque el clustering key lo ordena por tiempo descendente
SELECT * FROM user_timeline WHERE user_id = ? LIMIT 20;
```

Compaction strategies: STCS (Size-Tiered — write-heavy), LCS (Leveled — read-heavy), TWCS (Time-Window — time-series).

### Grafos — Neo4j

```cypher
// Encontrar el camino más corto entre dos usuarios
MATCH (a:User {id: "1"}), (b:User {id: "100"})
MATCH path = shortestPath((a)-[:FOLLOWS|:MENTIONS*]-(b))
RETURN path
```

Cuando los datos son inherentemente conectados (recomendaciones, detección de fraude, redes sociales), el modelo gráfico supera a SQL en órdenes de magnitud para queries de travesía.

## CAP y consistencia

CAP no es "elige 2 de 3" — es: durante una partición de red, eliges entre consistencia y disponibilidad. El teorema PACELC extiende esto: incluso sin partición, hay tradeoff entre latencia y consistencia.

| Sistema | Durante partición | Normal |
|---------|------------------|--------|
| PostgreSQL | Consistente (no disponible en nodos caídos) | Fuerte |
| MongoDB (default) | Disponible (lecturas eventuales) | Eventual |
| Cassandra | Disponible (consistencia configurable por query) | Tunable |
| Redis Cluster | Disponible (pérdida de writes en partición) | Fuerte por nodo |

Eventual consistency no es opcional en sistemas distribuidos. Los patrones para manejarla: CRDTs (conflict-free replicated data types), vector clocks, last-write-wins con timestamps.

## SQL Injection — la amenaza real

```javascript
// ❌ Esto es SQL injection aunque tu backend esté tipado
const query = `SELECT * FROM users WHERE email = '${userInput}'`

// ✅ Prepared statement — la ÚNICA defensa correcta
db.query("SELECT * FROM users WHERE email = $1", [userInput])
```

El peligro no es solo `' OR 1=1 --`. Existen inyecciones a ciegas (blind boolean-based, time-based), error-based (extraer datos mediante mensajes de error), y second-order (el payload se almacena y ejecuta después).

Los ORMs no te salvan automáticamente. Prisma parameteriza por defecto, pero `$queryRawUnsafe` existe. Knex permite raw queries sin parámetros. Siempre verifica que tu ORM esté generando prepared statements a nivel de driver.

## Framework de decisión

| Necesitas | Elige | Por qué |
|-----------|-------|---------|
| Joins complejos, transacciones, reportes | PostgreSQL | Madurez, extensibilidad, ACID |
| Write-heavy, multi-región, queries conocidas | Cassandra | Escrituras lineales, sin SPOF |
| Tiempo real, sesiones, rate-limiting | Redis | Operaciones en memoria, estructuras nativas |
| Prototipado rápido, esquema flexible | MongoDB | Documentos embebidos, sin migraciones |
| Grafos de relación, recomendaciones | Neo4j | Travesía en O(log n) vs O(n^m) en SQL |

La base de datos no es una decisión secundaria. Modela tus datos primero, elige el motor después. Una elección incorrecta al inicio = migración costosa al final.
