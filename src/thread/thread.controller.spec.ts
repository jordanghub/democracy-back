import { Test, TestingModule } from '@nestjs/testing';
import { ThreadController } from './thread.controller';

describe('Thread Controller', () => {
  let controller: ThreadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadController],
    }).compile();

    controller = module.get<ThreadController>(ThreadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
