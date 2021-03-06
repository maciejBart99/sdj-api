import { Action } from '@ngrx/store';
import { Track } from '@sdj/ng/radio/core/domain';

export class MostPlayedTracksReceivedEvent implements Action {
  static type = '[Track] Most Played Tracks Received';
  type = MostPlayedTracksReceivedEvent.type;

  constructor(public tracks: Track[]) {}
}
