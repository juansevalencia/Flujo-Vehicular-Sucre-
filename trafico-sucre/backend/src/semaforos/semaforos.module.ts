import { Module } from '@nestjs/common';
import { SemaforosController } from './semaforos.controller';
import { SemaforosService } from './semaforos.service';

@Module({
  controllers: [SemaforosController],
  providers: [SemaforosService]
})
export class SemaforosModule {}
