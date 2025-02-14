import { Injectable } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import { QueueNames } from './queue.constants';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(QueueNames.DOWNLOAD) private downloadQueue: Queue) {}

  async addToQueue(data: any, options: JobsOptions = {}) {
    const queue = this.getQueue();

    await queue.add('task', data, { attempts: 3, backoff: 5000, ...options });

    return { message: `Tarefa adicionada à fila` };
  }

  getQueue(): Queue {
    return this.downloadQueue;
  }
}
