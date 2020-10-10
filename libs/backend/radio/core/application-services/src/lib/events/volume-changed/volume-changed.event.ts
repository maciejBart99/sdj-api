import { IEvent } from '@nestjs/cqrs';

export class VolumeChangedEvent implements IEvent {
  constructor(public channelId: string, public volume: number) {}
}
