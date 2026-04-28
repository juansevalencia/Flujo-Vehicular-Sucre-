import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class DijkstraService {
  async calcularRuta(origenId: string, destinoId: string) {
    // Cargar el grafo completo desde PostgreSQL
    const aristas = await prisma.edge.findMany();

    // Construir lista de adyacencia
    const grafo: Map<string, { vecino: string; peso: number }[]> = new Map();
    for (const arista of aristas) {
      if (!grafo.has(arista.fromId)) grafo.set(arista.fromId, []);
      grafo.get(arista.fromId)!.push({ vecino: arista.toId, peso: arista.length });
    }

    // Dijkstra
    const distancias: Map<string, number> = new Map();
    const anteriores: Map<string, string | null> = new Map();
    const visitados: Set<string> = new Set();
    const cola: { nodo: string; dist: number }[] = [];

    distancias.set(origenId, 0);
    cola.push({ nodo: origenId, dist: 0 });

    while (cola.length > 0) {
      // Sacar el nodo con menor distancia
      cola.sort((a, b) => a.dist - b.dist);
      const { nodo: actual } = cola.shift()!;

      if (visitados.has(actual)) continue;
      visitados.add(actual);

      if (actual === destinoId) break;

      const vecinos = grafo.get(actual) ?? [];
      for (const { vecino, peso } of vecinos) {
        if (visitados.has(vecino)) continue;
        const nuevaDist = (distancias.get(actual) ?? Infinity) + peso;
        if (nuevaDist < (distancias.get(vecino) ?? Infinity)) {
          distancias.set(vecino, nuevaDist);
          anteriores.set(vecino, actual);
          cola.push({ nodo: vecino, dist: nuevaDist });
        }
      }
    }

    // Reconstruir el camino
    const camino: string[] = [];
    let actual: string | null = destinoId;
    while (actual !== null && actual !== undefined) {
      camino.unshift(actual);
      actual = anteriores.get(actual) ?? null;
    }

    if (camino[0] !== origenId) {
      return { error: 'No existe ruta entre estos nodos' };
    }

    // Buscar coordenadas de los nodos del camino
    const nodos = await prisma.node.findMany({
      where: { id: { in: camino } },
      select: { id: true, lat: true, lon: true },
    });

    const nodosMap = new Map(nodos.map(n => [n.id, n]));
    const coordenadas = camino.map(id => nodosMap.get(id));

    return {
      distanciaTotal: Math.round(distancias.get(destinoId) ?? 0),
      cantidadNodos: camino.length,
      camino: coordenadas,
    };
  }
}