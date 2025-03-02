import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { ProcessVideoDto } from './dto/process-video.dto';
import { StorageService } from 'src/storage/storage.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FilterVideosDto } from './dto/filter-video.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { extractUser } from 'src/utility/helpers';
import { QueueService } from 'src/queues/queue.service';

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly queueService: QueueService,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  list(@Query() filters: FilterVideosDto) {
    return this.videoService.searchVideos(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('youtube-id/:id')
  async findByYoutubeId(@Param('id') id: string, @Req() req: FastifyRequest) {
    const user = extractUser(req);
    const video = await this.videoService.findByYoutubeId(id, user.id);
    if (video) return video;
    throw new HttpException(
      'Youtube video ID not found.',
      HttpStatus.NOT_FOUND,
    );
  }

  @Delete('youtube-id/:id')
  async deleteByYoutubeId(@Param('id') id: string) {
    const deletedResponse = await this.videoService.deleteByYoutubeId(id);
    if (deletedResponse.affected === 0)
      throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
    return {
      message: 'The video was deleted',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stream/:id')
  async streamAudio(@Param('id') id: string, @Res() reply: FastifyReply) {
    try {
      const stream = await this.storageService.getAudioStream(id);

      reply.header('Content-Type', 'audio/mpeg');
      reply.header('Transfer-Encoding', 'chunked');

      return reply.send(stream);
    } catch (error) {
      console.log(error?.message);
      throw new HttpException('Audio not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('author/:id')
  async findByAuthor(@Param('id') id: string) {
    return this.videoService.findByAuthor(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('process')
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  @HttpCode(HttpStatus.CREATED)
  async process(
    @Body() processVideoDto: ProcessVideoDto,
    @Req() req: FastifyRequest,
  ) {
    const user = extractUser(req);

    const videoAlreadyExists = await this.videoService.findByYoutubeUrl(
      processVideoDto.videoUrl,
    );

    if (videoAlreadyExists)
      throw new HttpException('Video Id already exists', HttpStatus.CONFLICT);

    await this.videoService.schedulePreProcessing(user.id, processVideoDto);

    return {
      message: 'Video processing scheduled. Check back later.',
    };
  }

  @Get('/queue')
  async getQueue() {
    const queue = this.queueService.getPreProcessQueue();
    const [total, list] = await Promise.all([
      queue.count(),
      queue.getDelayed(),
    ]);
    return {
      total,
      list,
    };
  }
}
