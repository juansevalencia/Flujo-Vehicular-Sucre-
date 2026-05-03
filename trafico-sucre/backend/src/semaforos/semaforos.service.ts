import { Injectable } from '@nestjs/common'; //se usa como service
import { PrismaClient } from '@prisma/client'; //comunicacion bd

const prisma = new PrismaClient(); //creo instancia para hacer consultas

@Injectable()
export class SemaforosService {

  // Modelo M/M/1: calcula métricas de la cola
  calcularMMUno(lambda: number, mu: number) {
    if (lambda >= mu) {
      return { error: 'Sistema inestable: λ debe ser menor que μ' };
    }
    const rho = lambda / mu;                    // Utilización del servidor
    const Lq = (rho * rho) / (1 - rho);        // Autos esperando en cola
    const L = rho / (1 - rho);                 // Autos en el sistema
    const Wq = Lq / lambda;                    // Tiempo promedio esperando
    const W = L / lambda;                      // Tiempo promedio en sistema

    return {
      utilizacion: Math.round(rho * 100) / 100,
      autosEnCola: Math.round(Lq * 100) / 100,
      autosEnSistema: Math.round(L * 100) / 100,
      tiempoEsperaSegundos: Math.round(Wq * 100) / 100,
      tiempoSistemaSegundos: Math.round(W * 100) / 100,
    };
  }

  async getSemaforos() { //async es funcion asincronica , acceder a la BD no es instantaneo
    return prisma.intersection.findMany(); //devuelve todos los semaforos de la BD
  }

  async getMetricasSemaforo(nodeId: string) { 
    const semaforo = await prisma.intersection.findUnique({
      where: { nodeId },
    });

    if (!semaforo) {
      return { error: 'Semáforo no encontrado' };
    }

    const metricas = this.calcularMMUno(
      semaforo.arrivalRate,
      semaforo.serviceRate,
    );

    return {
      nodeId,
      greenTime: semaforo.greenTime,
      redTime: semaforo.redTime,
      arrivalRate: semaforo.arrivalRate,
      serviceRate: semaforo.serviceRate,
      ...metricas,
    };
  }
//como lo dice el nombre, optimizamos = actualizamos valores.
  async optimizarSemaforo(nodeId: string) {
    const semaforo = await prisma.intersection.findUnique({
      where: { nodeId },
    });

    if (!semaforo) return { error: 'Semáforo no encontrado' };

    // Algoritmo greedy: si la cola es larga, aumentar el tiempo verde
    const metricas = this.calcularMMUno(
      semaforo.arrivalRate,
      semaforo.serviceRate,
    );

    if ('error' in metricas) return metricas;

    let nuevoGreen = semaforo.greenTime;
    let nuevoRed = semaforo.redTime;

    if (metricas.autosEnCola > 3) {
      nuevoGreen = Math.min(semaforo.greenTime + 10, 90);
      nuevoRed = Math.max(semaforo.redTime - 10, 10);
    } else if (metricas.autosEnCola < 1) {
      nuevoGreen = Math.max(semaforo.greenTime - 10, 10);
      nuevoRed = Math.min(semaforo.redTime + 10, 90);
    }

    const actualizado = await prisma.intersection.update({
      where: { nodeId },
      data: { greenTime: nuevoGreen, redTime: nuevoRed },
    });

    return {
      antes: { greenTime: semaforo.greenTime, redTime: semaforo.redTime },
      despues: { greenTime: actualizado.greenTime, redTime: actualizado.redTime },
      metricas,
    };
  }
}