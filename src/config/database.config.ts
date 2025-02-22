import { TypeOrmModuleOptions } from '@nestjs/typeorm';
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
  entities: ['dist/src/**/entities/*.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  synchronize: false,
};

export const AppDataSource = new DataSource(databaseConfig);
