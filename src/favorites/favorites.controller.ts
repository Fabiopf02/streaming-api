import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FastifyRequest } from 'fastify';
import { extractUser } from 'src/utility/helpers';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':videoId')
  async toggleFavorite(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Req() req: FastifyRequest,
  ) {
    const user = extractUser(req);
    return this.favoriteService.toggleFavorite(user.id, videoId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserFavorites(@Req() req: FastifyRequest) {
    const user = extractUser(req);
    return this.favoriteService.getUserFavorites(user.id);
  }
}
