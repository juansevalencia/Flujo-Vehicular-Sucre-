import { Controller, Post, Body } from '@nestjs/common';
import { DijkstraService } from './dijkstra.service';

@Controller('ruta')
export class DijkstraController {
  constructor(private readonly dijkstraService: DijkstraService) {}

  @Post()
  calcularRuta(@Body() body: { origenId: string; destinoId: string }) {
    return this.dijkstraService.calcularRuta(body.origenId, body.destinoId);
  }
}