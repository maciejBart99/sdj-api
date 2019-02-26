import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTrackHandler } from './cqrs/command-bus/handlers/create-track.handler';
import { DownloadAndPlayHandler } from './cqrs/command-bus/handlers/download-and-play.handler';
import { DownloadTrackHandler } from './cqrs/command-bus/handlers/download-track.handler';
import { FuckYouHandler } from './cqrs/command-bus/handlers/fuck-you.handler';
import { HeartHandler } from './cqrs/command-bus/handlers/heart.handler';
import { PlayQueuedTrackHandler } from './cqrs/command-bus/handlers/play-queued-track.handler';
import { PlaySilenceHandler } from './cqrs/command-bus/handlers/play-silence.handler';
import { QueueTrackHandler } from './cqrs/command-bus/handlers/queue-track.handler';
import { ThumbUpHandler } from './cqrs/command-bus/handlers/thumb-up.handler';
import { RedisGetNextHandler } from './cqrs/events/handlers/redis-get-next.handler';
import { RedisSagas } from './cqrs/events/sagas/redis.sagas';
import { DbModule } from './modules/db/db.module';
import { QueuedTrackRepository } from './modules/db/repositories/queued-track.repository';
import { IcesService } from './services/ices.service';
import { Mp3Service } from './services/mp3.service';
import { PlaylistService } from './services/playlist.service';
import { RedisService } from './services/redis.service';
import { WebSocketService } from './services/web-socket.service';
import { PlaylistStore } from './store/playlist.store';

export const CommandHandlers = [
    CreateTrackHandler,
    DownloadAndPlayHandler,
    DownloadTrackHandler,
    FuckYouHandler,
    HeartHandler,
    PlayQueuedTrackHandler,
    PlaySilenceHandler,
    QueueTrackHandler,
    ThumbUpHandler
];

export const EventHandlers = [
    RedisGetNextHandler
];

@Global()
@Module({
    imports: [
        DbModule,
        CQRSModule
    ],
    providers: [
        ...CommandHandlers,
        ...EventHandlers,
        IcesService,
        Mp3Service,
        PlaylistService,
        PlaylistStore,
        RedisSagas,
        RedisService,
        WebSocketService
    ],
    exports: [
        IcesService,
        Mp3Service,
        PlaylistService,
        PlaylistStore,
        RedisService,
        WebSocketService
    ]
})
export class CoreModule implements OnModuleInit {
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly command$: CommandBus,
        private readonly event$: EventBus,
        private readonly redisSagas: RedisSagas,
        private readonly redisService: RedisService,
        @InjectRepository(QueuedTrackRepository) private queuedTrackRepository: QueuedTrackRepository
    ) {
    }

    onModuleInit(): any {
        this.command$.setModuleRef(this.moduleRef);
        this.event$.setModuleRef(this.moduleRef);

        this.event$.register(EventHandlers);
        this.command$.register(CommandHandlers);
        this.event$.combineSagas([
            // this.redisSagas.getNext
        ]);

        this.queuedTrackRepository.redisService = this.redisService;
    }
}
