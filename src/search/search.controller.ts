import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { YoutubeService } from 'src/youtube/youtube.service';

@Controller('search')
export class SearchController {
  constructor(
    @Inject(YoutubeService)
    private readonly youtubeService: YoutubeService,
  ) {}

  @Get()
  search(@Query('query') query: string) {
    return this.youtubeService.searchVideos(query);
  }

  @Get('video')
  async getVideoById(@Query('id') query: string) {
    const videoSearched = await this.youtubeService.searchByYoutubeId(query);
    if (videoSearched) return videoSearched;
    throw new HttpException('Searched video not found', HttpStatus.NOT_FOUND);
  }
}
