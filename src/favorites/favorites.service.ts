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
      return false;
    }

    const newFavorite = this.favoriteRepository.create({ user, video });

    await this.favoriteRepository.save(newFavorite);

    return true;
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
        'video.createdAt',
        'video.updatedAt',
        'video.thumbnail',
        'video.status',
        'video.requestedBy',
        'author.id',
        'author.youtubeId',
        'author.name',
        'author.avatar',
        'author.channelUrl',
        'author.createdAt',
        'author.updatedAt',
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
          description: favorite.video_description,
          url: favorite.video_url,
          durationInSeconds: favorite.video_durationInSeconds,
          category: favorite.video_category,
          uploadDate: favorite.video_uploadDate,
          thumbnail: favorite.video_thumbnail,
          status: favorite.video_status,
          createdAt: favorite.video_createdAt,
          updatedAt: favorite.video_updatedAt,
          requestedBy: favorite.video_requestedBy,
          author: {
            id: favorite.author_id,
            youtubeId: favorite.author_youtubeId,
            name: favorite.author_name,
            avatar: favorite.author_avatar,
            channelUrl: favorite.author_channelUrl,
            createdAt: favorite.author_createdAt,
            updatedAt: favorite.author_updatedAt,
          },
          isFavorite: true,
        },
      };
    });
  }
}
