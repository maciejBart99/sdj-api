import { Test } from '@nestjs/testing';
import { BackendAuthUiRestController } from './backend-auth-ui-rest.controller';

describe('BackendAuthUiRestController', () => {
  let controller: BackendAuthUiRestController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [BackendAuthUiRestController],
    }).compile();

    controller = module.get(BackendAuthUiRestController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
