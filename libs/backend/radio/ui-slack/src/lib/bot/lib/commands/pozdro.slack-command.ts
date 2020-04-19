import { Injectable } from '@nestjs/common';
import {
  PozdroEvent,
  RadioFacade
} from '@sdj/backend/radio/core/application-services';
import { UserDomainRepository } from '@sdj/backend/radio/core/domain-service';
import { LoggerService } from '@sdj/backend/shared/infrastructure-logger';
import {
  SlackCommand,
  SlackCommandHandler,
  SlackMessage,
  SlackService
} from '@sikora00/nestjs-slack-bot';

@SlackCommandHandler()
@Injectable()
export class PozdroSlackCommand implements SlackCommand {
  description: string =
    'wyślij pozdro swoim ziomeczkom (może też być dla mamy)';
  type: string = 'pozdro';

  constructor(
    private readonly logger: LoggerService,
    private radioFacade: RadioFacade,
    private userRepository: UserDomainRepository
  ) {}

  async handler(command: string[], message: SlackMessage): Promise<void> {
    command.shift();
    const pozdro = command.join(' ');

    if (pozdro.length > 200) {
      throw new Error('too long');
    }

    const user = await this.userRepository.findOne(message.user);

    if (user) {
      this.logger.verbose(user.realName + ' mowi: ' + pozdro);
      this.radioFacade.pozdro(new PozdroEvent(message.channel, pozdro));
    }
  }
}
