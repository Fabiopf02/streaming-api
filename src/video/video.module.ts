import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoQueueProcessor } from './video.processor';
import { QueueModule } from 'src/queues/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { AuthorModule } from 'src/author/author.module';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    StorageModule,
    YoutubeModule,
    AuthorModule,
    QueueModule,
    TypeOrmModule.forFeature([Video]),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoQueueProcessor],
})
export class VideoModule {}
