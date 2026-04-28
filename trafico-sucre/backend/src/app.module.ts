import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrafoModule } from './grafo/grafo.module';
import { DijkstraModule } from './dijkstra/dijkstra.module';

@Module({
  imports: [GrafoModule, DijkstraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
