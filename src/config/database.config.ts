import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Author } from 'src/author/entities/author.entity';
import { Favorite } from 'src/favorites/entities/favorites.entity';
import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

type DatabaseConfig = TypeOrmModuleOptions & {
  type: 'postgres';
};

export const databaseConfig: DatabaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  entities: [Author, Video, User, Favorite],
  synchronize: false,
  migrations: ['migrations/*.ts'],
  migrationsRun: false,
};

const dataSource = new DataSource(databaseConfig);

export default dataSource;
