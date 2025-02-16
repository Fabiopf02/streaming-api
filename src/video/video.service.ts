import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/queues/queue.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { ScheduleProcessingDto } from './dto/process-video.dto';
import { UpdateVideoStatusDto } from './dto/update-video.dto';

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

  create(createVideoDto: CreateVideoDto) {
    return this.videoRepository.save(createVideoDto);
  }

  findByYoutubeId(youtubeId: string) {
    return this.videoRepository.findOneBy({ youtubeId });
  }

  findByYoutubeUrl(url: string) {
    return this.videoRepository.findOneBy({ url });
  }

  async updateStatus(updateVideoStatusDto: UpdateVideoStatusDto) {
    const { id, status } = updateVideoStatusDto;
    return this.videoRepository.update({ id }, { status });
  }

  deleteByYoutubeId(youtubeId: string) {
    return this.videoRepository.delete({ youtubeId });
  }
}
