'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Nodo {
  id: string;
  lat: number;
  lon: number;
}

interface PuntoRuta {
  id: string;
  lat: number;
  lon: number;
}

interface Arista {
  id: string;
  fromId: string;
  toId: string;
}

interface Semaforo {
  id: string;
  nodeId: string;
  arrivalRate: number;
  serviceRate: number;
  greenTime: number;
  redTime: number;
}

export default function Mapa() {
  const [nodos, setNodos] = useState<Nodo[]>([]);
  const [origenId, setOrigenId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [ruta, setRuta] = useState<PuntoRuta[]>([]);
  const [distancia, setDistancia] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [aristas, setAristas] = useState<Arista[]>([]);
  const [semaforos, setSemaforos] = useState<Semaforo[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/grafo/nodos')
      .then(r => r.json())
      .then(setNodos);
    fetch('http://localhost:3000/grafo/aristas')
      .then(r => r.json())
      .then(setAristas);
    fetch('http://localhost:3000/semaforos')
      .then(r => r.json())
      .then(setSemaforos);  
  }, []);

  const calcularRuta = async () => {
    if (!origenId || !destinoId) return;
    setCargando(true);
    const res = await fetch('http://localhost:3000/ruta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origenId, destinoId }),
    });
    const data = await res.json();
    setRuta(data.camino ?? []);
    setDistancia(data.distanciaTotal ?? null);
    setCargando(false);
  };

  const coordenadasRuta = ruta.map(n => [n.lat, n.lon] as [number, number]);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {/* Panel de control */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000,
        background: 'white', padding: 16, borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)', minWidth: 260,
      }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 'bold' }}>
          🚗 Sucre → Libertador
        </h2>
        <input
          placeholder="ID Nodo Origen"
          value={origenId}
          onChange={e => setOrigenId(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          placeholder="ID Nodo Destino"
          value={destinoId}
          onChange={e => setDestinoId(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          onClick={calcularRuta}
          disabled={cargando}
          style={{
            width: '100%', padding: 8, background: '#2563eb',
            color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer',
          }}
        >
          {cargando ? 'Calculando...' : 'Calcular Ruta con Dijkstra'}
        </button>
        {distancia !== null && (
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#16a34a' }}>
            ✅ Distancia: {distancia} metros
          </p>
        )}
      </div>

      {/* Mapa */}
      <MapContainer
        center={[-34.5574, -58.4466]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap'
        />

        {/* Calles del grafo */}
        {aristas.map(arista => {
          const desde = nodos.find(n => n.id === arista.fromId);
          const hasta = nodos.find(n => n.id === arista.toId);
          if (!desde || !hasta) return null;
          return (
            <Polyline
              key={arista.id}
              positions={[[desde.lat, desde.lon], [hasta.lat, hasta.lon]]}
              color="#ef4444"
              weight={2}
              opacity={0.6}
            />
          );
        })}

        {/* Nodos del grafo */}
        {nodos.map(nodo => (
          <CircleMarker
            key={nodo.id}
            center={[nodo.lat, nodo.lon]}
            radius={4}
            color="#3b82f6"
            fillOpacity={0.7}
          >
            <Popup>ID: {nodo.id}</Popup>
          </CircleMarker>
        ))}

        {/* Semáforos */}
        {semaforos.map(sem => {
          const nodo = nodos.find(n => n.id === sem.nodeId);
          if (!nodo) return null;
          const utilizacion = sem.arrivalRate / sem.serviceRate;
          const color = utilizacion > 0.8 ? '#ef4444' : utilizacion > 0.6 ? '#f97316' : '#22c55e';
          return (
            <CircleMarker
              key={sem.id}
              center={[nodo.lat, nodo.lon]}
              radius={12}
              color={color}
              fillColor={color}
              fillOpacity={0.9}
            >
              <Popup>
                <strong>🚦 Semáforo</strong><br />
                Utilización: {Math.round(utilizacion * 100)}%<br />
                Verde: {sem.greenTime}s | Rojo: {sem.redTime}s<br />
                λ: {sem.arrivalRate} | μ: {sem.serviceRate}
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Ruta calculada */}
        {coordenadasRuta.length > 1 && (
          <Polyline
            positions={coordenadasRuta}
            color="#ef4444"
            weight={4}
          />
        )}
      </MapContainer>
    </div>
  );
}
