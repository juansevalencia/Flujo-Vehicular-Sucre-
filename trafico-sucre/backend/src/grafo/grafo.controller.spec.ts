import { Test, TestingModule } from '@nestjs/testing';
import { GrafoController } from './grafo.controller';

describe('GrafoController', () => {
  let controller: GrafoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrafoController],
    }).compile();

    controller = module.get<GrafoController>(GrafoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
