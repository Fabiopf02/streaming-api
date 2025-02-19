import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/queues/queue.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { In, Repository } from 'typeorm';
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

  async findByYoutubeId(youtubeId: string) {
    const response = await this.videoRepository.findOne({
      where: { youtubeId },
      relations: { author: true },
    });
    return response;
  }

  findByYoutubeUrl(url: string) {
    return this.videoRepository.findOneBy({ url });
  }

  findExisting(youtubeIds: string[]) {
    return this.videoRepository.find({
      where: { youtubeId: In(youtubeIds) },
      select: [
        'youtubeId',
        'title',
        'thumbnail',
        'url',
        'author',
        'durationInSeconds',
        'description',
        'status',
      ],
      relations: { author: true },
    });
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
