import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Author } from 'src/author/entities/author.entity';
import { Favorite } from 'src/favorites/entities/favorites.entity';
import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    password: configService.get('DB_PASSWORD'),
    username: configService.get('DB_USERNAME'),
    database: configService.get('DB_DATABASE'),
    entities: [Author, Video, User, Favorite],
    synchronize: true,
  }),
  inject: [ConfigService],
};
