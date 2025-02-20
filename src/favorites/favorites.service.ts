import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { Repository } from 'typeorm';
import { Video } from 'src/video/entities/video.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}
  async toggleFavorite(userId: number, videoId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
    });

    if (!user || !video) {
      throw new NotFoundException('User or video not found');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { user: { id: user.id }, video: { id: video.id } },
    });

    if (existingFavorite) {
      await this.favoriteRepository.remove(existingFavorite);
      return {
        message: 'Video removed from favorites',
      };
    }

    const newFavorite = this.favoriteRepository.create({ user, video });

    await this.favoriteRepository.save(newFavorite);

    return {
      message: 'Video added to favorites',
    };
  }

  async getUserFavorites(userId: number) {
    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .innerJoinAndSelect('favorite.video', 'video')
      .innerJoinAndSelect('video.author', 'author')
      .select([
        'favorite.id',
        'favorite.favoritedAt',
        'video.id',
        'video.youtubeId',
        'video.title',
        'LEFT(video.description, 220) as video_description',
        'video.url',
        'video.durationInSeconds',
        'video.category',
        'video.uploadDate',
        'video.thumbnail',
        'video.status',
        'video.requestedBy',
        'author.id',
        'author.youtubeId',
        'author.name',
        'author.avatar',
        'author.channelUrl',
      ])
      .where('favorite.user_id = :userId', { userId })
      .getRawMany();

    return favorites.map((favorite) => {
      return {
        favoriteId: favorite.favorite_id,
        favoritedAt: favorite.favorite_favoritedAt,
        video: {
          id: favorite.video_id,
          youtubeId: favorite.video_youtubeId,
          title: favorite.video_title,
          category: favorite.video_category,
          url: favorite.video_url,
          thumbnail: favorite.video_thumbnail,
          description: favorite.video_description,
          status: favorite.video_status,
          durationInSeconds: favorite.video_durationInSeconds,
          requestedBy: favorite.video_requestedBy,
          author: {
            id: favorite.author_id,
            youtubeId: favorite.author_youtubeId,
            name: favorite.author_name,
            avatar: favorite.author_avatar,
            channelUrl: favorite.author_channelUrl,
          },
          isFavorite: true,
        },
      };
    });
  }
}
