import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { QueuedTrack } from '../../../entities/queued-track.model';
import { PlaylistService } from '../../shared/services/playlist.service';
import * as redis from 'redis';

@Injectable()
export class WebSocketService {
  public playDj = new Subject<QueuedTrack>();
  public playRadio = new Subject<void>();
  private redisClient;
  private redisSub;

  constructor(private playlist: PlaylistService) {
    this.redisClient = redis.createClient({
      host: 'redis'
    });
    this.redisSub = redis.createClient({
      host: 'redis'
    });

    this.subscribeToRedisGetNext()
  }

  private subscribeToRedisGetNext(): void {

    let count = 0;

    this.redisSub.on('message', (channel, message) => {
      this.playlist.getNext().subscribe(queuedTrack => {
        console.log(channel, message);
        if (queuedTrack) {
          count = 0;
          this.playDj.next(queuedTrack);
          this.redisClient.set('next_song', queuedTrack.track.id);
          this.playlist.updateQueuedTrackPlayedAt(queuedTrack).subscribe();
        } else {
          count = count + 1;
          this.redisClient.set('next_song', '10-sec-of-silence');
          if (count > 1) {
            this.playRadio.next();
          }
        }
      });
    });

    this.redisSub.subscribe('getNext');
  }
}
