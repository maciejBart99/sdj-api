import { Injectable } from '@angular/core';
import { QueuedTrack } from '@sdj/ng/core/queued-track/domain';
import { QueuedTrackRepository } from '@sdj/ng/core/queued-track/infrastructure';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class QueuedTrackFacade {
  queuedTracks$ = new BehaviorSubject<QueuedTrack[]>([]);
  currentTrack$ = this.queuedTracks$.pipe(
    map<QueuedTrack[], QueuedTrack>(list => list[0])
  );
  queuedTracksSub: Subscription;

  constructor(private queuedTrackRepository: QueuedTrackRepository) {}

  loadQueuedTracks(channelId: string): void {
    if (this.queuedTracksSub) {
      this.queuedTracksSub.unsubscribe();
    }
    this.queuedTracksSub = this.queuedTrackRepository
      .getQueuedTracks(channelId)
      .subscribe(queuedTracks => {
        this.queuedTracks$.next(queuedTracks);
      });
  }
}