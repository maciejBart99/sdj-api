import { Injectable } from '@nestjs/common';
import {
  RadioFacade,
  VolumeSetCommand,
} from '@sdj/backend/radio/core/application-services';
import { ChannelRepositoryInterface } from '@sdj/backend/radio/core/domain';
import {
  SlackCommand,
  SlackCommandHandler,
  SlackMessage,
  SlackService,
} from '@sikora00/nestjs-slack-bot';

@SlackCommandHandler()
@Injectable()
export class VolumeDownSlackCommand implements SlackCommand {
  description: string = 'Ciszej!';
  type: string = ':sound:';

  static VOLUME_STEP = 25;

  constructor(
    private readonly radioFacade: RadioFacade,
    private slack: SlackService,
    private channelRepository: ChannelRepositoryInterface
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    try {
      const volume = (await this.channelRepository.findById(message.channel))
        .volume;
      const fixedVolume = Math.max(
        0,
        volume - VolumeDownSlackCommand.VOLUME_STEP
      );
      await this.radioFacade.setVolume(
        new VolumeSetCommand(message.channel, message.user, fixedVolume)
      );
      await this.slack.sendMessage(
        `Obecna głośność ${fixedVolume} % :)`,
        message.channel
      );
    } catch (err) {
      await this.slack.sendMessage(err.message, message.channel);
    }
  }
}
