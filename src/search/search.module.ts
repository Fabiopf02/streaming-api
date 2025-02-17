import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { YoutubeService } from 'src/youtube/youtube.service';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [VideoModule],
  controllers: [SearchController],
  providers: [YoutubeService],
})
export class SearchModule {}
