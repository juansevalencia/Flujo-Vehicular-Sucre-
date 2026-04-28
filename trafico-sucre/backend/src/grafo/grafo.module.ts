import { Module } from '@nestjs/common';
import { GrafoController } from './grafo.controller';
import { GrafoService } from './grafo.service';

@Module({
  controllers: [GrafoController],
  providers: [GrafoService]
})
export class GrafoModule {}
