import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { VolumeChangedEvent } from '@sdj/backend/radio/core/application-services';
import { ChannelRepositoryInterface } from '@sdj/backend/radio/core/domain';
import { VolumeSetCommand } from './volume-set.command';

@CommandHandler(VolumeSetCommand)
export class VolumeSetHandler implements ICommandHandler<VolumeSetCommand> {
  constructor(
    private eventBus: EventBus,
    private channelRepository: ChannelRepositoryInterface
  ) {}

  async execute(command: VolumeSetCommand): Promise<any> {
    const channel = await this.channelRepository.findById(command.channelId);
    channel.volume = command.volume;
    await this.channelRepository.save(channel);
    await this.eventBus.publish(
      new VolumeChangedEvent(command.channelId, command.volume)
    );
  }
}
