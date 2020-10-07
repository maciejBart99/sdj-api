import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthFacade,
  LoginQuery,
} from '@sdj/backend/auth/core/application-services';
import { LoginRequest } from './requests/login.request';

@Controller('auth')
export class BackendAuthUiRestController {
  constructor(private authFacade: AuthFacade) {}

  @Post('login')
  async logIn(@Body() body: LoginRequest) {
    return await this.authFacade.login(new LoginQuery(body.token));
  }
}
