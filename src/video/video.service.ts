import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/queues/queue.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { ScheduleProcessingDto } from './dto/process-video.dto';
import { UpdateVideoStatusDto } from './dto/update-video.dto';
import { FilterVideosDto } from './dto/filter-video.dto';

@Injectable()
export class VideoService {
  constructor(
    private readonly queueService: QueueService,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
  ) {}

  async scheduleProcessing(scheduleProcessingDto: ScheduleProcessingDto) {
    return this.queueService.addToQueue(scheduleProcessingDto, { delay: 5000 });
  }

  create(userId: number, createVideoDto: CreateVideoDto) {
    return this.videoRepository.save({
      ...createVideoDto,
      requestedBy: userId,
    });
  }

  async findByYoutubeId(youtubeId: string, userId: number) {
    const videoData = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.author', 'author')
      .leftJoinAndSelect(
        'video.favorites',
        'favorite',
        'favorite.user_id = :userId',
        { userId },
      )
      .where('video.youtubeId = :youtubeId', { youtubeId })
      .getOne();
    if (!videoData) return null;

    const { favorites, ...restData } = videoData;
    return {
      ...restData,
      isFavorite: favorites?.length > 0,
    };
  }

  findByYoutubeUrl(url: string) {
    return this.videoRepository.findOneBy({ url });
  }

  async findExisting(youtubeIds: string[], userId: number) {
    const result = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect(
        'video.favorites',
        'favorite',
        'favorite.user_id = :userId',
        { userId },
      )
      .innerJoinAndSelect('video.author', 'author')
      .select([
        'video.id',
        'video.youtubeId',
        'video.title',
        'video.thumbnail',
        'video.url',
        'video.durationInSeconds',
        'LEFT(video.description, 220) as description',
        'video.status',
        'video.requestedBy',

        'author.id',
        'author.youtubeId',
        'author.name',
        'author.avatar',

        'favorite.id as favorite_id',
      ])
      .where('video.youtubeId in (:...ids)', { ids: youtubeIds })
      .getRawMany();

    return result.map((record) => ({
      id: record.video_id,
      youtubeId: record.video_youtubeId,
      title: record.video_title,
      thumbnail: record.video_thumbnail,
      url: record.video_url,
      author: {
        id: record.author_author_id,
        youtubeId: record.author_youtubeId,
        name: record.author_name,
        avatar: record.author_avatar,
      },
      durationInSeconds: record.video_durationInSeconds,
      description: record.description,
      status: record.video_status,
      requestedBy: record.video_requestedBy,
      isFavorite: !!record.favorite_id,
    }));
  }

  async searchVideos({ search, page, limit, order }: FilterVideosDto) {
    const query = this.videoRepository
      .createQueryBuilder('video')
      .select([
        'video.id as id',
        'video.youtubeId as youtubeId',
        'video.title as title',
        'LEFT(video.description, 220) as description',
        'video.durationInSeconds as duration',
        'video.thumbnail as thumbnail',
        'video.status as status',
        'video.requestedBy as requestedBy',
      ])
      .where(
        '(LOWER(video.title) ILIKE LOWER(:term) OR LOWER(video.description) ILIKE LOWER(:term))',
        {
          term: `%${search}%`,
        },
      );

    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      query
        .skip(skip)
        .limit(limit)
        .orderBy('video.uploadDate', order)
        .getRawMany(),
      query.getCount(),
    ]);

    return {
      data: videos,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(updateVideoStatusDto: UpdateVideoStatusDto) {
    const { id, status } = updateVideoStatusDto;
    return this.videoRepository.update({ id }, { status });
  }

  deleteByYoutubeId(youtubeId: string) {
    return this.videoRepository.delete({ youtubeId });
  }
}
