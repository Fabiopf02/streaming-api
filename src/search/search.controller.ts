import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { VideoStatus } from 'src/video/enums/video-status.enum';
import { VideoService } from 'src/video/video.service';
import { YoutubeService } from 'src/youtube/youtube.service';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(YoutubeService)
    private readonly youtubeService: YoutubeService,
    @Inject(VideoService)
    private readonly videoService: VideoService,
  ) {}

  @Get()
  async search(@Query('query') query: string) {
    const youtubeVideos = await this.youtubeService.searchVideos(query);
    const youtubeIds = youtubeVideos.map((ytVideo) => ytVideo.youtubeId);
    const existingVideos = await this.videoService.findExisting(youtubeIds);
    const existingVideoMap = new Map(
      existingVideos.map((video) => [video.youtubeId, video]),
    );
    const mergedResults = youtubeVideos.map((ytVideo) => {
      const local = existingVideoMap.get(ytVideo.youtubeId);
      if (local) return local;
      return {
        youtubeId: ytVideo.youtubeId,
        title: ytVideo.title,
        thumbnail: ytVideo.thumbnail,
        url: ytVideo.url,
        author: ytVideo.author,
        durationInSeconds: ytVideo.durationInSeconds,
        description: ytVideo.description,
        status: VideoStatus.NOT_PROCESSED,
      };
    });

    return {
      data: mergedResults,
      meta: {
        total: mergedResults.length,
      },
    };
  }

  @Get('video')
  async getVideoById(@Query('id') query: string) {
    const videoSearched = await this.youtubeService.searchByYoutubeId(query);
    if (videoSearched) return videoSearched;
    throw new HttpException('Searched video not found', HttpStatus.NOT_FOUND);
  }
}
