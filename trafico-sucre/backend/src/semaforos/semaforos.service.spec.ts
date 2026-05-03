import { Test, TestingModule } from '@nestjs/testing';
import { SemaforosService } from './semaforos.service';

describe('SemaforosService', () => {
  let service: SemaforosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemaforosService],
    }).compile();

    service = module.get<SemaforosService>(SemaforosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
