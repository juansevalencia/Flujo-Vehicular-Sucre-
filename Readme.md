# 🚗 TraficoSucre 

Simulador de flujo vehicular sobre el corredor **Sucre → Libertador, Buenos Aires** usando datos reales de OpenStreetMap.

Podes calcular el camino minimo desde cualquier punto en un rango aproximado de 10 cuadras desde sucre y libertador.
Hay solamente 3 semaforos cargados, la idea es mostrar que es totalmente extendible para cargar todos los semforos.

A partir de estos 3 semaforos podes generar un reporte en pdf sobre el estado del transito de estos semaforos, en la sección instalación vas a ver que se describe como instalarlo para que lo pruebes!

![Captura del sistema](Flujo-Vehicular-Sucre-/Screenshot from 2026-05-11 12-31-02.png)

![Captura del sistema](Flujo-Vehicular-Sucre-/Screenshot from 2026-05-11 12-34-01.png)


> Calles reales · Intersecciones · Ruta calculada con Dijkstra · Reportes PDF por email

---

## Arquitectura

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    Next.js 16    │────▶│     NestJS        │────▶│    Laravel       │
│   (Frontend)     │     │  (API + Dijkstra) │     │ (Reportes PDF)   │
│  Leaflet + OSM   │     │  Prisma + PG      │     │  DomPDF + SMTP   │
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
| **Teoría de colas M/M/1** | Modelado de flujo vehicular en semáforos |
| **Colas asíncronas** | Laravel Queues para generación de reportes PDF |

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16, React, Leaflet, Tailwind CSS |
| Backend | NestJS, Prisma, PostgreSQL |
| Reportes | Laravel 10, DomPDF, SMTP |
| Infraestructura | Docker, Docker Compose |
| Datos | OpenStreetMap via osmnx (Python) |

---

## Requisitos

- Docker y Docker Compose
- Node.js 20+
- PHP 8.1+ y Composer
- Python 3 con `osmnx` y `pandas`
- Una cuenta de [Mailtrap](https://mailtrap.io) (gratis) **o** credenciales SMTP propias

---

## Configuración de email (obligatorio antes de levantar)

El sistema de reportes PDF **envía un mail** con el PDF adjunto. Para eso necesitás configurar un servicio SMTP en `reports/.env`.

### Opción A — Mailtrap (recomendada para desarrollo, gratis)

1. Creá una cuenta gratuita en [mailtrap.io](https://mailtrap.io)
2. Andá a **Email Testing → My Sandbox → Integration → SMTP**
3. Copiá las credenciales y pegá esto en `trafico-sucre/reports/.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu_username_de_mailtrap
MAIL_PASSWORD=tu_password_de_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=trafico@sucre.com
MAIL_FROM_NAME="TraficoSucre"
```

> Los mails **no llegan a ningún inbox real** — los intercepta Mailtrap pero :
### Opción B — Gmail

Necesitás generar un **App Password** en tu cuenta Google (Seguridad → Verificación en dos pasos → Contraseñas de aplicación):

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tuemail@gmail.com
MAIL_PASSWORD=tu_app_password_de_16_caracteres
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tuemail@gmail.com
MAIL_FROM_NAME="TraficoSucre"
```

### Opción C — Solo ver logs (sin configurar nada)

Si no querés configurar email, podés cambiar el driver a `log` para que el PDF quede registrado en el log en vez de enviarse:

```env
MAIL_MAILER=log
```

El PDF generado aparece codificado en `reports/storage/logs/laravel.log`.

---

## Instalación

### 1. Cloná el repo

```bash
git clone <tu-repo>
cd trafico-sucre
```

### 2. Configurá el email

Editá `trafico-sucre/reports/.env` con tus credenciales SMTP (ver sección anterior).

### 3. Levantá todo con el script

```bash
chmod +x arrancar.sh
./arrancar.sh
```

Este script levanta Docker (PostgreSQL, MySQL, Redis), el backend NestJS y el frontend Next.js automáticamente.

### 4. Abrí el navegador

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

### Laravel (reportes)
```bash
cd reports
composer install
php artisan config:clear
php artisan serve --port=8000
```

---

## Generar un reporte PDF

Una vez levantado todo, enviá un POST al endpoint de reportes:

```bash
curl -X POST http://localhost:8000/api/reportes \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com"}'
```

```json
{ "mensaje": "Reporte en proceso, lo recibirás por email en breve." }
```

El PDF llega al email indicado (o a tu bandeja de Mailtrap) con las métricas actuales de los semáforos: utilización M/M/1, tiempos de verde/rojo y estado de congestión.

También podés dispararlo desde `php artisan tinker`:

```bash
cd reports
php artisan tinker
\App\Jobs\GenerarReportePDF::dispatch('tu@email.com');
```

---

## Endpoints de la API

| Método | URL | Descripción |
|---|---|---|
| `GET` | `/grafo/nodos` | Devuelve los 198 nodos del grafo |
| `GET` | `/grafo/aristas` | Devuelve las 376 aristas |
| `POST` | `/ruta` | Calcula ruta más corta con Dijkstra |
| `GET` | `/semaforos` | Estado actual de los semáforos (M/M/1) |
| `POST` | `/api/reportes` | Genera y envía el reporte PDF por email |

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
├── frontend/             ← Next.js 16
│   └── src/
│       ├── app/
│       │   └── page.tsx
│       └── components/
│           └── Mapa.tsx
├── backend/              ← NestJS
│   └── src/
│       ├── grafo/        ← Endpoints de nodos y aristas
│       ├── dijkstra/     ← Algoritmo de camino mínimo
│       └── semaforos/    ← Modelo M/M/1
└── reports/              ← Laravel 10
    ├── .env              ← ⚠️ Configurar MAIL_* antes de usar
    └── app/
        ├── Jobs/
        │   └── GenerarReportePDF.php  ← Job que genera y envía el PDF
        └── Mail/
            └── ReporteMail.php
```

> En muchas carpetas hay archivos `.md` explicando qué hace cada módulo. Hay uno general `Documento.md` y otro en `backend/`. Los archivos también tienen comentarios internos como guía.

---

## Roadmap

- [x] Grafo real de Sucre/Libertador desde OpenStreetMap
- [x] API REST con NestJS
- [x] Algoritmo de Dijkstra
- [x] Visualización interactiva con Leaflet
- [x] Modelo de colas M/M/1 en semáforos
- [x] Optimización greedy de tiempos de semáforo
- [x] Reporte PDF generado con DomPDF y enviado por email
- [ ] Boton reporte PDF (para dejar de hacerlo manualmente, mas friendly)