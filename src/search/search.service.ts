import { Injectable } from '@nestjs/common';
import { search } from 'yt-search';

@Injectable()
export class SearchService {
  async searchVideos(query: string) {
    const result = await search({ query });
    return result.videos.map((video) => ({
      id: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      url: video.url,
      author: video.author,
      duration: video.duration,
      description: video.description,
      views: video.views,
    }));
  }
}
