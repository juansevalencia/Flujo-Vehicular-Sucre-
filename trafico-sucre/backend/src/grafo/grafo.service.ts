import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class GrafoService {
  async getNodos() {
    return prisma.node.findMany({
      select: {
        id: true,
        lat: true,
        lon: true,
      },
    });
  }

  async getAristas() {
    return prisma.edge.findMany({
      select: {
        id: true,
        fromId: true,
        toId: true,
        length: true,
        name: true,
      },
    });
  }
}