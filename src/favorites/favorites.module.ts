import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Video, Favorite])],
  controllers: [FavoritesController],
  providers: [FavoritesService, JwtService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
