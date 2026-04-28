import { Test, TestingModule } from '@nestjs/testing';
import { DijkstraController } from './dijkstra.controller';

describe('DijkstraController', () => {
  let controller: DijkstraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DijkstraController],
    }).compile();

    controller = module.get<DijkstraController>(DijkstraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
