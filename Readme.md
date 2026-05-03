# 🚗 TraficoSucre

Simulador de flujo vehicular sobre el corredor **Sucre → Libertador, Buenos Aires** usando datos reales de OpenStreetMap.

Proyecto académico que aplica conceptos de **Ciencias de la Computación** (grafos, algoritmos de camino mínimo, teoría de colas) en un problema urbano real.

---
En muchas carpetas hay md explicando que hace cada cosa. Hay uno genral Documento.md , otro en backend y comentarios dentro de los arhcivos que sirven como guia !!!



> Calles reales , Intersecciones , Ruta calculada con Dijkstra

---

## Arquitectura

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    Next.js 16    │────▶│     NestJS        │────▶│    Laravel       │
│   (Frontend)     │     │  (API + Dijkstra) │     │ (Reportes PDF)   │
│  Leaflet + OSM   │     │  Prisma + PG      │     │  Queues + Redis  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                  │
                            PostgreSQL
                         198 nodos / 376 aristas
```

---

## Conceptos de CS aplicados

| Concepto | Dónde |
|---|---|
| **Grafos dirigidos** | Modelado de calles con nodos y aristas desde OpenStreetMap |
| **Algoritmo de Dijkstra** | Cálculo de ruta más corta entre intersecciones |
| **Teoría de colas M/M/1** | Modelado de flujo vehicular en semáforos (WIP) |
| **Colas asíncronas** | Laravel Queues + Redis para generación de reportes |

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16, React, Leaflet, Tailwind CSS |
| Backend | NestJS, Prisma, PostgreSQL |
| Reportes | Laravel, MySQL, Redis |
| Infraestructura | Docker, Docker Compose |
| Datos | OpenStreetMap via osmnx (Python) |

---

## Requisitos

- Docker y Docker Compose
- Node.js 20+
- Python 3 con `osmnx` y `pandas`

---

## Guia instalación

### 1. Cloná el repo

```bash
git clone <tu-repo>
cd trafico-sucre
```

### 2. Levantá todo con el script

```bash
chmod +x arrancar.sh
./arrancar.sh
```

Este script levanta Docker, el backend y el frontend automáticamente.

### 3. Abrí el navegador

```
http://localhost:3001
```

---

## Uso manual (sin el script)

### Bases de datos
```bash
docker compose up -d
```

### Backend NestJS
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Next.js
```bash
cd frontend
npm install
npm run dev
```

---

## Endpoints de la API

| Método | URL | Descripción |
|---|---|---|
| `GET` | `/grafo/nodos` | Devuelve los 198 nodos del grafo |
| `GET` | `/grafo/aristas` | Devuelve las 376 aristas |
| `POST` | `/ruta` | Calcula ruta más corta con Dijkstra |

### Ejemplo — Calcular ruta

```bash
curl -X POST http://localhost:3000/ruta \
  -H "Content-Type: application/json" \
  -d '{"origenId": "89286420", "destinoId": "5793023264"}'
```

```json
{
  "distanciaTotal": 91,
  "cantidadNodos": 2,
  "camino": [
    { "id": "89286420", "lat": -34.5592, "lon": -58.4472 },
    { "id": "5793023264", "lat": -34.5597, "lon": -58.4480 }
  ]
}
```

---

## Estructura del proyecto

```
trafico-sucre/
├── arrancar.sh           ← Script para levantar todo
├── docker-compose.yml    ← PostgreSQL, MySQL, Redis
├── extract_graph.py      ← Descarga el grafo de OpenStreetMap
├── nodes.json            ← 198 intersecciones
├── edges.json            ← 376 calles
├── frontend/             ← Next.js
│   └── src/
│       ├── app/
│       │   └── page.tsx
│       └── components/
│           └── Mapa.tsx
├── backend/              ← NestJS
│   └── src/
│       ├── grafo/        ← Endpoints de nodos y aristas
│       ├── dijkstra/     ← Algoritmo de camino mínimo
│       └── semaforos/    ← Modelo M/M/1 (WIP)
└── reports/              ← Laravel (WIP)
```

---

## Roadmap

- [x] Grafo real de Sucre/Libertador desde OpenStreetMap
- [x] API REST con NestJS
- [x] Algoritmo de Dijkstra
- [x] Visualización interactiva con Leaflet
- [x] Modelo de colas M/M/1 en semáforos
- [x] Optimización greedy de tiempos de semáforo
- [ ] Reporte PDF con Laravel
- [ ] Animación paso a paso de Dijkstra

--