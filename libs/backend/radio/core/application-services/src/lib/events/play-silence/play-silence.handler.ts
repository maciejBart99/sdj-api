import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Store } from '@sdj/backend/radio/core/domain-service';
import { PlaySilenceEvent } from './play-silence.event';

@EventsHandler(PlaySilenceEvent)
export class PlaySilenceHandler implements IEventHandler<PlaySilenceEvent> {
  constructor(private readonly storageService: Store) {}

  async handle(command: PlaySilenceEvent): Promise<unknown> {
    const channelId = command.channelId;
    let count = await this.storageService.getSilenceCount(channelId);
    count++;
    this.storageService.setSilenceCount(channelId, count);
    const prevTrack = await this.storageService.getCurrentTrack(channelId);
    if (prevTrack) {
      this.storageService.removeFromQueue(prevTrack);
    }
    return this.storageService.setCurrentTrack(channelId, null);
  }
}
