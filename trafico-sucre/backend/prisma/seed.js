const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cargando grafo de Sucre/Libertador...');

  const nodesPath = path.join(__dirname, '../../nodes.json');
  const edgesPath = path.join(__dirname, '../../edges.json');

  const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf-8'));
  const edges = JSON.parse(fs.readFileSync(edgesPath, 'utf-8'));

  console.log(`📍 Insertando ${nodes.length} nodos...`);
  for (const node of nodes) {
    await prisma.node.upsert({
      where: { osmid: BigInt(node.osmid) },
      update: {},
      create: {
        id: String(node.osmid),
        osmid: BigInt(node.osmid),
        lat: node.y,
        lon: node.x,
      },
    });
  }

  console.log(`🛣️  Insertando ${edges.length} aristas...`);
  for (const edge of edges) {
    await prisma.edge.upsert({
      where: { id: `${edge.u}-${edge.v}` },
      update: {},
      create: {
        id: `${edge.u}-${edge.v}`,
        fromId: String(edge.u),
        toId: String(edge.v),
        length: edge.length ?? 0,
        name: edge.name ?? null,
        maxspeed: Array.isArray(edge.maxspeed) 
          ? edge.maxspeed[0] 
          : (edge.maxspeed ?? null),
      },
    });
  }

  // Insertar semáforos
  console.log('🚦 Insertando semáforos...');
  const semaforos = [
    { nodeId: '81840856',  arrivalRate: 0.8, serviceRate: 1.2, greenTime: 30, redTime: 30 },
    { nodeId: '89314609',  arrivalRate: 0.6, serviceRate: 1.0, greenTime: 25, redTime: 35 },
    { nodeId: '241040483', arrivalRate: 0.9, serviceRate: 1.1, greenTime: 40, redTime: 20 },
  ];

  for (const semaforo of semaforos) {
    await prisma.intersection.upsert({
      where: { nodeId: semaforo.nodeId },
      update: {},
      create: semaforo,
    });
  }
  console.log('✅ Semáforos insertados!');

  console.log('✅ Grafo cargado exitosamente!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
