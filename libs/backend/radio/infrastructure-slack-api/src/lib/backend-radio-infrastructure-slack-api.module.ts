import { Module } from '@nestjs/common';
import { SlackApiService } from '@sdj/backend/shared/application-services';
import { HttpSlackApiService } from './http-slack-api.service';

@Module({
  providers: [{ provide: SlackApiService, useClass: HttpSlackApiService }],
  exports: [SlackApiService],
})
export class BackendRadioInfrastructureSlackApiModule {}
