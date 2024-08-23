import { Test, TestingModule } from '@nestjs/testing';
import { UserThingsController } from './user-things.controller';

describe('UserThingsController', () => {
  let controller: UserThingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserThingsController],
    }).compile();

    controller = module.get<UserThingsController>(UserThingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
