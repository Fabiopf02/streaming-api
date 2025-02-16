import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { search } from 'yt-search';
import * as ytdl from '@distube/ytdl-core';

@Injectable()
export class YoutubeService {
  async getVideoInfo(url: string) {
    try {
      const info = await ytdl.getInfo(url);
      const videoDetails = info.videoDetails;
      return {
        youtubeId: videoDetails.videoId,
        title: videoDetails.title,
        description: videoDetails.description || undefined,
        thumbnail: videoDetails.thumbnails[0].url,
        url: videoDetails.video_url,
        author: {
          id: videoDetails.author.id,
          name: videoDetails.author.name,
          avatar: videoDetails.author.avatar,
          channelUrl: videoDetails.author.channel_url,
          user: videoDetails.author.user || null,
        },
        category: videoDetails.category,
        uploadDate: videoDetails.uploadDate,
        durationInSeconds: Number(videoDetails.lengthSeconds),
      };
    } catch {
      throw new HttpException('Invalid youtube URL', HttpStatus.BAD_REQUEST);
    }
  }

  getAudioStream(url: string) {
    return ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
  }

  async searchVideos(query: string) {
    const result = await search({ query });
    return result.videos.map((video) => ({
      youtubeId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      url: video.url,
      author: video.author,
      durationInSeconds: video.duration,
      description: video.description,
    }));
  }

  async searchByYoutubeId(id: string) {
    try {
      const video = await search({ videoId: id });
      return {
        youtubeId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        url: video.url,
        author: video.author,
        durationInSeconds: video.duration.seconds,
        description: video.description,
        category: video.genre,
        uploadDate: video.uploadDate,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }
}
