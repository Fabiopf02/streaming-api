import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { extractUser } from 'src/utility/helpers';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async search(@Query('query') query: string, @Req() req: FastifyRequest) {
    const user = extractUser(req);
    const youtubeVideos = await this.youtubeService.searchVideos(query);
    const youtubeIds = youtubeVideos.map((ytVideo) => ytVideo.youtubeId);
    const existingVideos = await this.videoService.findExisting(
      youtubeIds,
      user.id,
    );
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
        durationInSeconds: ytVideo.durationInSeconds.seconds,
        description: ytVideo.description,
        status: VideoStatus.NOT_PROCESSED,
        isFavorite: false,
      };
    });

    return {
      data: mergedResults,
      meta: {
        total: mergedResults.length,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('video')
  async getVideoById(@Query('id') query: string) {
    const videoSearched = await this.youtubeService.searchByYoutubeId(query);
    if (videoSearched) return videoSearched;
    throw new HttpException('Searched video not found', HttpStatus.NOT_FOUND);
  }
}
