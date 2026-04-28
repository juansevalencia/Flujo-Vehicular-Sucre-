# 🗺️ Frontend — Next.js con Leaflet

## ¿Qué construimos?

Una aplicación web interactiva que muestra el grafo real de **Sucre y Libertador, Buenos Aires** y permite calcular rutas con el algoritmo de Dijkstra.

---

## Stack usado

| Tecnología | Para qué |
|---|---|
| **Next.js 16** | Framework React con App Router |
| **Leaflet + react-leaflet** | Mapa interactivo |
| **OpenStreetMap** | Tiles del mapa (gratuito) |
| **Tailwind CSS** | Estilos |

---

## Estructura del proyecto

```
frontend/
└── src/
    ├── app/
    │   └── page.tsx          ← Página principal, carga el mapa
    └── components/
        └── Mapa.tsx          ← Componente central de la app
```

---

## `page.tsx` — Página principal

```tsx
'use client';
import dynamic from 'next/dynamic';

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false });
```

### ¿Por qué `dynamic` con `ssr: false`?
Leaflet usa `window` y `document` del navegador. En Next.js, el servidor intenta renderizar los componentes primero (SSR), pero en el servidor no existe `window`. Con `ssr: false` le decimos a Next.js que cargue el mapa **solo en el navegador**.

---

## `Mapa.tsx` — El componente principal

### Estados
```tsx
const [nodos, setNodos] = useState<Nodo[]>([]);        // 198 intersecciones
const [aristas, setAristas] = useState<Arista[]>([]);  // 376 calles
const [ruta, setRuta] = useState<PuntoRuta[]>([]);     // resultado de Dijkstra
const [distancia, setDistancia] = useState<number | null>(null);
```

### Fetching de datos
Al cargar el componente, pide los datos a NestJS:
```tsx
useEffect(() => {
  fetch('http://localhost:3000/grafo/nodos').then(...).then(setNodos);
  fetch('http://localhost:3000/grafo/aristas').then(...).then(setAristas);
}, []);
```

### Calcular ruta con Dijkstra
```tsx
const res = await fetch('http://localhost:3000/ruta', {
  method: 'POST',
  body: JSON.stringify({ origenId, destinoId }),
});
```

---

## Capas del mapa

### 1. Calles (aristas) — verde
```tsx
<Polyline
  positions={[[desde.lat, desde.lon], [hasta.lat, hasta.lon]]}
  color="#22c55e"
  weight={2}
/>
```
Dibuja cada calle del grafo como una línea entre dos nodos.

### 2. Intersecciones (nodos) — azul
```tsx
<CircleMarker center={[nodo.lat, nodo.lon]} radius={4} color="#3b82f6">
  <Popup>ID: {nodo.id}</Popup>
</CircleMarker>
```
Cada intersección es un círculo clickeable que muestra su ID.

### 3. Ruta calculada — rojo
```tsx
<Polyline positions={coordenadasRuta} color="#ef4444" weight={4} />
```
Se dibuja encima de las calles cuando Dijkstra devuelve una ruta.

---

## CORS
NestJS necesita permitir requests desde el frontend. Se configuró en `main.ts`:
```typescript
app.enableCors({ origin: 'http://localhost:3001' });
```

---

## Resultado final

- 🟢 **Calles en verde** — grafo real de OpenStreetMap
- 🔵 **Nodos en azul** — 198 intersecciones reales
- 🔴 **Ruta en rojo** — camino más corto calculado con Dijkstra
- 📏 **Distancia en metros** — resultado del algoritmo