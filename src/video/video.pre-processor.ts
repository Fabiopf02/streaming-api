import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueNames } from 'src/queues/queue.constants';
import { ProcessVideoDto } from './dto/process-video.dto';
import { Inject, Logger } from '@nestjs/common';
import { VideoService } from './video.service';
import { YoutubeService } from 'src/youtube/youtube.service';
import { AuthorService } from 'src/author/author.service';
import { CreateAuthorDto } from 'src/author/dto/create-author.dto';

@Processor(QueueNames.PRE_PROCESSING, {
  autorun: process.env.ENABLE_PROCESSOR === 'true',
  concurrency: 20,
})
export class VideoQueuePreProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoQueuePreProcessor.name);

  constructor(
    @Inject(VideoService) private readonly videoService: VideoService,
    @Inject(YoutubeService) private readonly youtubeService: YoutubeService,
    @Inject(AuthorService) private readonly authorService: AuthorService,
  ) {
    super();
  }

  async process(job: Job<ProcessVideoDto & { userId: number }>) {
    const { id, name, data } = job;

    this.logger.log(
      `🎬 Processando job: ${id}, nome: ${name}, Video Url: ${data.videoUrl}`,
    );

    await this.processVideoInfo(data);
  }

  private async processVideoInfo(data: ProcessVideoDto & { userId: number }) {
    const searchedVideo = await this.youtubeService.getVideoInfo(data.videoUrl);

    if (!searchedVideo) throw new Error('Youtube video not found');

    let author = await this.authorService.findOneByUrl(
      searchedVideo.author.channelUrl,
    );

    if (!author) {
      const createAuthorDto = new CreateAuthorDto();
      createAuthorDto.name = searchedVideo.author.name;
      createAuthorDto.channelUrl = searchedVideo.author.channelUrl;
      createAuthorDto.avatar = searchedVideo.author.avatar;
      createAuthorDto.youtubeId = searchedVideo.author.id;
      createAuthorDto.user = searchedVideo.author.user!;
      author = await this.authorService.create(createAuthorDto);
    }

    const createdVideo = await this.videoService.create(data.userId, {
      youtubeId: searchedVideo.youtubeId,
      url: data.videoUrl,
      title: searchedVideo.title,
      description: searchedVideo.description,
      category: searchedVideo.category,
      thumbnail: searchedVideo.thumbnail,
      uploadDate: searchedVideo.uploadDate,
      durationInSeconds: searchedVideo.durationInSeconds,
      author,
    });

    await this.videoService.scheduleDownloadProcessing({
      id: createdVideo.id,
      url: createdVideo.url,
      youtubeId: createdVideo.youtubeId,
    });

    this.logger.log(`✅ Video info saved for: ${data.videoUrl}`);

    return createdVideo;
  }
}
