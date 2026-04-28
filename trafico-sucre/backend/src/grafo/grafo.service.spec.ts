import { Test, TestingModule } from '@nestjs/testing';
import { GrafoService } from './grafo.service';

describe('GrafoService', () => {
  let service: GrafoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrafoService],
    }).compile();

    service = module.get<GrafoService>(GrafoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
