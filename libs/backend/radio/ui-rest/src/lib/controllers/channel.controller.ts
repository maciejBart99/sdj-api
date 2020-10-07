import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  GetChannelsQuery,
  GetChannelsReadModel,
  RadioFacade,
} from '@sdj/backend/radio/core/application-services';
import { Request } from 'express';
import { JwtAuthenticationGuard } from '../../../../../auth/ui-rest/src/lib/jwt-authentication.guard';

@Controller('channel')
export class ChannelController {
  constructor(private radioFacade: RadioFacade) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getChannels(@Req() request: Request): Promise<GetChannelsReadModel> {
    return this.radioFacade.getChannels(
      new GetChannelsQuery(request.user.token)
    );
  }
}
