import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './queues/queue.module';
import { VideoModule } from './video/video.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    QueueModule,
    AuthorModule,
    SearchModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
