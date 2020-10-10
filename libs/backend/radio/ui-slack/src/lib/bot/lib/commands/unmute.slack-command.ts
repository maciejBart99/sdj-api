import { Injectable } from '@nestjs/common';
import {
  RadioFacade,
  VolumeSetCommand,
} from '@sdj/backend/radio/core/application-services';
import {
  SlackCommand,
  SlackCommandHandler,
  SlackMessage,
  SlackService,
} from '@sikora00/nestjs-slack-bot';

@SlackCommandHandler()
@Injectable()
export class UnmuteSlackCommand implements SlackCommand {
  description: string = 'Odmutuj';
  type: string = ':speaker:';

  constructor(
    private readonly radioFacade: RadioFacade,
    private slack: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    try {
      await this.radioFacade.setVolume(
        new VolumeSetCommand(message.channel, message.user, 100)
      );
      await this.slack.sendMessage(`Lecimy... :)`, message.channel);
    } catch (err) {
      await this.slack.sendMessage(err.message, message.channel);
    }
  }
}
