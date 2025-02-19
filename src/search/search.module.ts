import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { YoutubeService } from 'src/youtube/youtube.service';
import { VideoModule } from 'src/video/video.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [VideoModule],
  controllers: [SearchController],
  providers: [YoutubeService, JwtService],
})
export class SearchModule {}
