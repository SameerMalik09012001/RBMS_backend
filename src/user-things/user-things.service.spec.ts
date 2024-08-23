import { Test, TestingModule } from '@nestjs/testing';
import { UserThingsService } from './user-things.service';

describe('UserThingsService', () => {
  let service: UserThingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserThingsService],
    }).compile();

    service = module.get<UserThingsService>(UserThingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
