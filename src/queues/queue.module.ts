import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { bullConfig } from 'src/config/bullmq.config';
import { QueueService } from './queue.service';
import { QueueNames } from './queue.constants';

@Module({
  imports: [
    BullModule.forRootAsync(bullConfig),
    BullModule.registerQueue(
      { name: QueueNames.DOWNLOAD },
      { name: QueueNames.PRE_PROCESSING },
    ),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
