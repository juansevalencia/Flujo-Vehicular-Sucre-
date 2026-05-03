import { Test, TestingModule } from '@nestjs/testing';
import { SemaforosController } from './semaforos.controller';

describe('SemaforosController', () => {
  let controller: SemaforosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemaforosController],
    }).compile();

    controller = module.get<SemaforosController>(SemaforosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
