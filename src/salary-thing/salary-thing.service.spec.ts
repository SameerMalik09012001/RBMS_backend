import { Test, TestingModule } from '@nestjs/testing';
import { SalaryThingService } from './salary-thing.service';

describe('SalaryThingService', () => {
  let service: SalaryThingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalaryThingService],
    }).compile();

    service = module.get<SalaryThingService>(SalaryThingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
