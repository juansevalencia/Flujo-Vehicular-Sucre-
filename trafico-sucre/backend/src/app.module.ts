import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrafoModule } from './grafo/grafo.module';
import { DijkstraModule } from './dijkstra/dijkstra.module';
import { SemaforosModule } from './semaforos/semaforos.module';

@Module({
  imports: [GrafoModule, DijkstraModule, SemaforosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
