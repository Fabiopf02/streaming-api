import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueNames } from 'src/queues/queue.constants';
import { QueueProcessor } from 'src/shared/processor';
import { ScheduleProcessingDto } from './dto/process-video.dto';
import { Inject } from '@nestjs/common';
import { VideoService } from './video.service';
import { StorageService } from 'src/storage/storage.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@Processor(QueueNames.DOWNLOAD, {
  autorun: process.env.ENABLE_PROCESSOR === 'true',
  concurrency: 15,
})
export class VideoQueueProcessor extends QueueProcessor {
  constructor(
    @Inject(VideoService) private readonly service: VideoService,
    @Inject(YoutubeService) private readonly youtube: YoutubeService,
    @Inject(StorageService) private readonly storage: StorageService,
  ) {
    super(VideoQueueProcessor.name);
    this.videoService = service;
  }

  async process(job: Job<ScheduleProcessingDto>) {
    const { id, name, data } = job;

    this.logger.log(
      `🎬 Processando job: ${id}, nome: ${name}, Video: ${data.id}`,
    );

    await this.downloadAudio(data.youtubeId, data.url);
  }

  private async downloadAudio(id: string, url: string) {
    this.logger.log(`🔄 Download from: ${url}`);
    const audioStream = this.youtube.getAudioStream(url);

    return await new Promise<void>((resolve, reject) => {
      this.storage
        .uploadAudio(id, audioStream)
        .then(() => {
          this.logger.log(`✅ Download Finished for: ${url}`);
          resolve();
        })
        .catch((error: Error) => {
          this.logger.log(`❌ Download failed to: ${url}`);
          reject(error);
        });
    });
  }
}
