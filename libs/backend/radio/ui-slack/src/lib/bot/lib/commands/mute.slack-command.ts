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
export class MuteSlackCommand implements SlackCommand {
  description: string = 'Wycisz muzykę';
  type: string = ':mute:';

  constructor(
    private readonly radioFacade: RadioFacade,
    private slack: SlackService
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    try {
      await this.radioFacade.setVolume(
        new VolumeSetCommand(message.channel, message.user, 0)
      );
      await this.slack.sendMessage(
        `Muzyka wyciszona. Aby wznowić muzykę wpisz :speaker: :)`,
        message.channel
      );
    } catch (err) {
      await this.slack.sendMessage(err.message, message.channel);
    }
  }
}
