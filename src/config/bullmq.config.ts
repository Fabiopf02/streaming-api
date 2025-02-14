import {
  BullRootModuleOptions,
  SharedBullAsyncConfiguration,
} from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const bullConfig: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): BullRootModuleOptions => {
    return {
      connection: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      },
    };
  },
  inject: [ConfigService],
};
