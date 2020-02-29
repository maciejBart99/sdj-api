import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { QueueTrackCommand } from '../queue-track/queue-track.command';
import { QueuedTrack } from '@sdj/backend/radio/core/domain';
import {
  ChannelDomainRepository,
  QueuedTrackDomainRepository,
  TrackDomainRepository
} from '@sdj/backend/radio/core/domain-service';
import { appConfig } from '@sdj/backend/shared/domain';
import { PlaySilenceEvent } from '../../events/play-silence/play-silence.event';
import { RadioFacade } from '../../radio.facade';
import { DownloadAndPlayCommand } from '../download-and-play/download-and-play.command';
import { PlayNextTrackOrSilenceCommand } from './play-next-track-or-silence.command';

@CommandHandler(PlayNextTrackOrSilenceCommand)
export class PlayNextTrackOrSilenceHandler
  implements ICommandHandler<PlayNextTrackOrSilenceCommand> {
  constructor(
    private eventBus: EventBus,
    private channelRepository: ChannelDomainRepository,
    private radioFacade: RadioFacade,
    private queuedTrackRepository: QueuedTrackDomainRepository,
    private trackRepository: TrackDomainRepository
  ) {}

  async execute(command: PlayNextTrackOrSilenceCommand): Promise<any> {
    const channel = await this.channelRepository.findOrCreate(
      command.channelId
    );
    const queuedTrack = await this.getNextTrack(channel.id);
    if (queuedTrack) {
      return this.radioFacade.downloadAndPlay(
        new DownloadAndPlayCommand(queuedTrack)
      );
    } else {
      this.eventBus.publish(new PlaySilenceEvent(channel.id));
    }
  }

  private async getNextTrack(
    channelId: string
  ): Promise<QueuedTrack | undefined> {
    const queuedTrack = await this.queuedTrackRepository.getNextSongInQueue(
      channelId
    );
    if (queuedTrack) {
      return queuedTrack;
    } else {
      const tracksInDb = await this.trackRepository.countTracks(channelId);
      if (tracksInDb >= appConfig.trackLengthToStartOwnRadio) {
        const randTrack = await this.trackRepository.getRandomTrack(channelId);
        if (randTrack) {
          const newQueuedTrack = await this.radioFacade.queueTrack(
            new QueueTrackCommand(randTrack.id, channelId, undefined, true)
          );
          return this.queuedTrackRepository.findOneOrFail(newQueuedTrack.id);
        }
      }
    }
  }
}
