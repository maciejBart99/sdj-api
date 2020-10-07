import { Test, TestingModule } from '@nestjs/testing';
import { LoginHandler } from './login.handler';

describe('LoginHandler', () => {
  let handler: LoginHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginHandler],
    }).compile();

    handler = module.get<LoginHandler>(LoginHandler);
  });

  test('creates itself', () => {
    expect(handler).toBeDefined();
  });
});
