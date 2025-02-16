import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { YoutubeService } from 'src/youtube/youtube.service';

@Module({
  controllers: [SearchController],
  providers: [YoutubeService],
})
export class SearchModule {}
