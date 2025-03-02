import { Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import { QueueNames } from './queue.constants';
import { InjectQueue } from '@nestjs/bullmq';
@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueNames.DOWNLOAD) private downloadQueue: Queue,
    @InjectQueue(QueueNames.PRE_PROCESSING) private preProcessQueue: Queue,
  ) {}

  async addToQueue(name: QueueNames, data: any, options: JobsOptions = {}) {
    const queue =
      name === QueueNames.DOWNLOAD
        ? this.getDownloadQueue()
        : this.getPreProcessQueue();

    const job = await queue.add('task', data, {
      attempts: 3,
      backoff: 5000,
      removeOnComplete: true,
      ...options,
    });

    return { id: job.id };
  }

  getDownloadQueue(): Queue {
    return this.downloadQueue;
  }

  getPreProcessQueue(): Queue {
    return this.preProcessQueue;
  }
}
