import { Controller, Get, Post, Param } from '@nestjs/common';
import { SemaforosService } from './semaforos.service';

@Controller('semaforos')
export class SemaforosController {
  constructor(private readonly semaforosService: SemaforosService) {}

  @Get()
  getSemaforos() {
    return this.semaforosService.getSemaforos();
  }

  @Get(':nodeId/metricas')
  getMetricas(@Param('nodeId') nodeId: string) {
    return this.semaforosService.getMetricasSemaforo(nodeId);
  }

  @Post(':nodeId/optimizar')
  optimizar(@Param('nodeId') nodeId: string) {
    return this.semaforosService.optimizarSemaforo(nodeId);
  }
}