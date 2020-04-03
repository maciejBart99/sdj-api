import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Channel, ChannelApiFacade } from '@sdj/ng/core/channel/api';
import { ExternalRadioEntity } from '@sdj/ng/core/radio/domain';
import { environment } from '@sdj/ng/core/shared/domain';
import { WebSocketClient } from '@sdj/ng/core/shared/port';
import { WebSocketEvents } from '@sdj/shared/domain';
import { merge, Observable, of } from 'rxjs';
import { filter, first, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { RadioPartialState } from '../+state/radio.reducer';
import { radioQuery } from '../+state/radio.selectors';
import { AudioSourceChangedEvent } from '../events/audio-source-changed.event';
import { ExternalRadioFacade } from '../external-radio.facade';
import { GetAudioSourceQuery } from './get-audio-source.query';

@Injectable({ providedIn: 'root' })
export class GetAudioSourceHandler {
  playDj$ = this.ws.observe(WebSocketEvents.playDj);
  playRadio$ = this.ws.observe(WebSocketEvents.playRadio);
  roomIsRunning$ = this.store.pipe(select(radioQuery.roomIsRunning));

  @Effect() handle$ = this.actions$.pipe(
    ofType(GetAudioSourceQuery.type),
    withLatestFrom(
      this.channelApiFacade.selectedChannel$,
      this.externalRadioFacade.selectedExternalRadio$
    ),
    switchMap(
      ([query, selectedChannel, selectedExternalRadio]: [
        GetAudioSourceQuery,
        Channel,
        ExternalRadioEntity
      ]) => this.handle(selectedChannel, selectedExternalRadio)
    )
  );

  constructor(
    private actions$: Actions,
    private channelApiFacade: ChannelApiFacade,
    private externalRadioFacade: ExternalRadioFacade,
    private store: Store<RadioPartialState>,
    private ws: WebSocketClient
  ) {}

  private static getStreamFromExternalRadioOrChannel(
    channel: Channel,
    externalRadio?: ExternalRadioEntity
  ): string {
    return externalRadio ? externalRadio.url : channel.defaultStreamUrl;
  }

  handle(
    channel: Channel,
    externalRadio: ExternalRadioEntity
  ): Observable<Action> {
    const selectedChannelId = channel.id;
    return merge(
      of(
        GetAudioSourceHandler.getStreamFromExternalRadioOrChannel(
          channel,
          externalRadio
        )
      ),
      this.roomIsRunning$.pipe(
        filter(Boolean),
        first(),
        switchMap(() =>
          merge(
            of(environment.radioStreamUrl + selectedChannelId),
            this.playDj$.pipe(
              map(() => environment.radioStreamUrl + selectedChannelId)
            ),
            this.playRadio$.pipe(
              map(() =>
                GetAudioSourceHandler.getStreamFromExternalRadioOrChannel(
                  channel,
                  externalRadio
                )
              )
            )
          )
        )
      )
    ).pipe(
      map(
        streamUrl =>
          new AudioSourceChangedEvent(streamUrl || environment.externalStream)
      )
    );
  }
}
