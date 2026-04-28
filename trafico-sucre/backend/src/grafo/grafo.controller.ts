import { Controller, Get } from '@nestjs/common';
import { GrafoService } from './grafo.service';

@Controller('grafo')
export class GrafoController {
  constructor(private readonly grafoService: GrafoService) {}

  @Get('nodos')
  getNodos() {
    return this.grafoService.getNodos();
  }

  @Get('aristas')
  getAristas() {
    return this.grafoService.getAristas();
  }
}