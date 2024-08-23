import { Test, TestingModule } from '@nestjs/testing';
import { SalaryThingController } from './salary-thing.controller';

describe('SalaryThingController', () => {
  let controller: SalaryThingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalaryThingController],
    }).compile();

    controller = module.get<SalaryThingController>(SalaryThingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
