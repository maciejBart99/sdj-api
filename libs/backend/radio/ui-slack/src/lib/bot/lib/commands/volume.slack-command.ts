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
export class VolumeSlackCommand implements SlackCommand {
  description: string = 'Ustaw głośność';
  type: string = 'volume';

  constructor(
    private readonly radioFacade: RadioFacade,
    private slack: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    try {
      console.log(command);
      const fixedVolume = Math.max(0, Math.min(100, Number(command[1])));
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
