import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ScheduleProcessingDto } from 'src/video/dto/process-video.dto';
import { VideoStatus } from 'src/video/enums/video-status.enum';
import { VideoService } from 'src/video/video.service';

export abstract class QueueProcessor extends WorkerHost {
  protected logger: Logger;
  protected videoService: VideoService;

  constructor(context: string) {
    super();
    this.logger = new Logger(context);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<ScheduleProcessingDto>) {
    const { id, name, queueName, finishedOn, data } = job;

    await this.videoService.updateStatus({
      id: data.id,
      status: VideoStatus.PROCESSED,
    });

    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job<ScheduleProcessingDto>) {
    const { id, name, progress } = job;
    this.logger.log(
      `Job id: ${id}, name: ${name} completes ${Number(progress)}%`,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<ScheduleProcessingDto>) {
    const { id, name, queueName, failedReason, data } = job;

    await this.videoService.updateStatus({
      id: data.id,
      status: VideoStatus.FAILED,
    });

    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  async onActive(job: Job<ScheduleProcessingDto>) {
    const { id, name, queueName, timestamp, data } = job;

    await this.videoService.updateStatus({
      id: data.id,
      status: VideoStatus.PROCESSING,
    });

    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
