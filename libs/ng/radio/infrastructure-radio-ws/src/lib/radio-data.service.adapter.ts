import { Injectable } from '@angular/core';
import { RadioDataService } from '@sdj/ng/radio/core/application-services';
import { WebSocketClient } from '@sdj/ng/shared/core/application-services';
import { WebSocketEvents } from '@sdj/shared/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RadioDataServiceAdapter implements RadioDataService {
  constructor(private ws: WebSocketClient) {}

  getPlayDj(): Observable<void> {
    return this.ws.observe(WebSocketEvents.playDj);
  }

  getPlayRadio(): Observable<void> {
    return this.ws.observe(WebSocketEvents.playRadio);
  }

  getVolume(): Observable<number> {
    return this.ws
      .observe<{ volume: number }>(WebSocketEvents.volumeChanged)
      .pipe(map((el) => el.volume));
  }
}
