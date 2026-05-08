#!/bin/bash

# ===========================================
# 🚗 TraficoSucre — Script de arranque
# ===========================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "🚗 Arrancando TraficoSucre..."
echo "================================"

# 0. Liberar puertos
echo "🔌 Liberando puertos..."
fuser -k 3000/tcp 2>/dev/null
fuser -k 3001/tcp 2>/dev/null
sleep 1

# 1. Docker
echo ""
echo "📦 Levantando base de datos con Docker..."
cd "$PROJECT_DIR"
docker compose up -d

echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 5

# 2. Backend NestJS
echo ""
echo "⚙️  Arrancando backend NestJS en puerto 3000..."
cd "$PROJECT_DIR/backend"
npm run start:dev &
BACKEND_PID=$!
echo "   PID del backend: $BACKEND_PID"

echo "⏳ Esperando que NestJS arranque..."
sleep 8

# 3. Frontend Next.js
echo ""
echo "🗺️  Arrancando frontend Next.js en puerto 3001..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
echo "   PID del frontend: $FRONTEND_PID"

# 4. Laravel
echo ""
echo "📄 Arrancando Laravel en puerto 8000..."
cd "$PROJECT_DIR/reports"
php artisan serve --port=8000 &
LARAVEL_PID=$!
echo "   PID de Laravel: $LARAVEL_PID"


echo ""
echo "================================"
echo "✅ Todo corriendo!"
echo ""
echo "   🗺️  Frontend:  http://localhost:3001"
echo "   ⚙️   Backend:   http://localhost:3000"
echo "   🔍  Nodos:     http://localhost:3000/grafo/nodos"
echo "   🔍  Aristas:   http://localhost:3000/grafo/aristas"
echo "   📄  Laravel:    http://localhost:8000"
echo ""
echo "Para detener todo, presioná Ctrl+C"
echo "================================"
echo ""

# Esperar y manejar Ctrl+C
trap "echo ''; echo '🛑 Deteniendo todo...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker compose stop; echo '✅ Todo detenido.'; exit 0" SIGINT SIGTERM

wait