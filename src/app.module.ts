import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './queues/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    QueueModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
