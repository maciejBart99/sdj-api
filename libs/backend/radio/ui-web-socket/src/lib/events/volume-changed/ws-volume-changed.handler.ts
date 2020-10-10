import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { VolumeChangedEvent } from '@sdj/backend/radio/core/application-services';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Gateway } from '../../gateway/gateway';

@EventsHandler(VolumeChangedEvent)
export class WsVolumeChangedHandler
  implements IEventHandler<VolumeChangedEvent> {
  constructor(private gateway: Gateway) {}

  async handle(event: VolumeChangedEvent): Promise<void> {
    await this.gateway.server
      .in(event.channelId)
      .emit(WebSocketEvents.volumeChanged, {
        volume: event.volume,
      });
  }
}
