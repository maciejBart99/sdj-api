import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { LoggerService } from '@sdj/backend/common';
import { MicroservicePattern } from '@sdj/backend/shared';
import { WebSocketEvents } from '@sdj/shared/common';
import { Gateway } from '../gateway';


@Controller()
export class WebSocketController {
  tmp: number = Math.floor(Math.random() * 10) || 0;
  constructor(
    private readonly logger: LoggerService,
    private readonly gateway: Gateway
  ) {}

  @EventPattern(MicroservicePattern.pozdro)
  pozdro(data: string): void {
    this.gateway.server.of('/').emit('pozdro', {
      message: data
    });
  }

  @EventPattern(MicroservicePattern.playDj)
  playDj(channelId: string): void {
    this.logger.log('dj', channelId);
    this.gateway.server.in(channelId).emit(WebSocketEvents.playDj);
  }

  @EventPattern(MicroservicePattern.playSilence)
  playRadio(channelId: string): void {
    this.logger.log('radio', channelId);
    this.gateway.server.in(channelId).emit(WebSocketEvents.playRadio);
  }
}
