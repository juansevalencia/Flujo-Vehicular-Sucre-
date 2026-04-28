# 🗂️ Estructura del Backend — TraficoSucre

## Raíz del proyecto `backend/`

```
backend/
├── src/
├── prisma/
├── test/
├── node_modules/
├── .env
├── nest-cli.json
├── package.json
├── package-lock.json
├── prisma.config.ts
├── tsconfig.json
└── tsconfig.build.json
```

---

## 📁 `src/` — El corazón de la aplicación

Acá vive toda la lógica de negocio. NestJS organiza el código en **módulos**.

```
src/
├── app.module.ts       ← Módulo raíz, importa todos los demás módulos
├── app.controller.ts   ← Controlador raíz (ruta GET / de prueba)
├── app.service.ts      ← Servicio raíz
└── main.ts             ← Punto de entrada, arranca el servidor HTTP
```

### `main.ts`
Es el archivo que **arranca todo**. Crea la app de NestJS y la pone a escuchar en un puerto (por defecto 3000).

```typescript
// Arranca el servidor en el puerto 3000
await app.listen(3000);
```

### `app.module.ts`
Es el **módulo raíz**. Funciona como un índice que le dice a NestJS qué módulos, controladores y servicios existen en la app. Cada feature nueva (grafo, semáforos, Dijkstra) va a ser un módulo que se importa acá.

### `app.controller.ts`
Define las **rutas HTTP** de la app. Por ahora solo tiene una ruta `GET /` de prueba. Nosotros vamos a crear controladores nuevos para el grafo y Dijkstra.

### `app.service.ts`
Contiene la **lógica de negocio** que usa el controlador. El controlador recibe el request, llama al servicio, y el servicio hace el trabajo pesado.

---

## 📁 `prisma/` — Base de datos

```
prisma/
├── schema.prisma    ← Define las tablas (Node, Edge, Intersection)
├── seed.js          ← Carga el grafo de Sucre/Libertador en PostgreSQL
└── migrations/      ← Historial de cambios de la base de datos
    └── 20260424_init/
        └── migration.sql
```

### `schema.prisma`
Es el **mapa de la base de datos**. Define qué tablas existen y cómo se relacionan. Cuando lo modificás y corrés `prisma migrate dev`, Prisma genera el SQL y actualiza la base de datos automáticamente.

### `seed.js`
Script que **pobló la base de datos** con los 198 nodos y 376 aristas del grafo real de Sucre/Libertador descargado de OpenStreetMap.

### `migrations/`
Carpeta que guarda el **historial de cambios** de la base de datos. Es como un `git` pero para el esquema SQL. Nunca se edita a mano.

---

## 📁 `test/` — Tests

```
test/
├── app.e2e-spec.ts   ← Test end-to-end de la app
└── jest-e2e.json     ← Configuración de Jest para tests e2e
```

Tests de extremo a extremo: simulan requests HTTP reales y verifican que la app responda correctamente. Lo usaremos al final del proyecto.

---

## 📄 Archivos de configuración

### `.env`
Guarda las **variables de entorno** (credenciales, URLs). Nunca se sube a GitHub.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trafico"
```

### `package.json`
Lista todas las **dependencias** del proyecto y los scripts disponibles (`npm run start`, `npm run build`, etc.). También tiene la configuración del seed de Prisma.

### `nest-cli.json`
Configuración del **CLI de NestJS**. Le dice cómo compilar y organizar el proyecto. No se toca normalmente.

### `tsconfig.json` y `tsconfig.build.json`
Configuración de **TypeScript**. Define cómo se compila el código TS a JS. `tsconfig.build.json` es la versión para producción que excluye los tests.

### `prisma.config.ts`
Configuración de **Prisma** (conexión a la base de datos). Específico de Prisma 5+.

---

## 🔄 Flujo de un request en NestJS

```
HTTP Request (GET /grafo/nodos)
        ↓
  Controller          ← Recibe el request, valida parámetros
        ↓
  Service             ← Ejecuta la lógica (consulta DB, corre Dijkstra)
        ↓
  Prisma Client       ← Habla con PostgreSQL
        ↓
  PostgreSQL          ← Devuelve los datos
        ↓
  HTTP Response       ← JSON con los nodos/resultado
```

---

## 📦 Lo que vamos a agregar

```
src/
├── grafo/
│   ├── grafo.module.ts
│   ├── grafo.controller.ts   ← GET /grafo/nodos, GET /grafo/aristas
│   └── grafo.service.ts      ← Consulta nodos y aristas de PostgreSQL
├── dijkstra/
│   ├── dijkstra.module.ts
│   ├── dijkstra.controller.ts ← POST /ruta (origen, destino)
│   └── dijkstra.service.ts    ← Implementación del algoritmo Dijkstra
└── semaforos/
    ├── semaforos.module.ts
    ├── semaforos.controller.ts ← GET /semaforos, PUT /semaforos/:id
    └── semaforos.service.ts    ← Modelo M/M/1, optimización greedy
```
