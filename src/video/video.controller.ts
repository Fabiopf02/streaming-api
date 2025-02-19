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
import { AuthorService } from 'src/author/author.service';
import { CreateAuthorDto } from 'src/author/dto/create-author.dto';
import { YoutubeService } from 'src/youtube/youtube.service';
import { StorageService } from 'src/storage/storage.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FilterVideosDto } from './dto/filter-video.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { extractUser } from 'src/utility/helpers';

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    @Inject(YoutubeService) private readonly youtubeService: YoutubeService,
    @Inject(AuthorService) private readonly authorService: AuthorService,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  list(@Query() filters: FilterVideosDto) {
    return this.videoService.searchVideos(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('youtube-id/:id')
  async findByYoutubeId(@Param('id') id: string) {
    const video = await this.videoService.findByYoutubeId(id);
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
  @Post('process')
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  @HttpCode(HttpStatus.CREATED)
  async process(
    @Body() processVideoDto: ProcessVideoDto,
    @Req() req: FastifyRequest,
  ) {
    try {
      const user = extractUser(req);

      const videoAlreadyExists = await this.videoService.findByYoutubeUrl(
        processVideoDto.videoUrl,
      );

      if (videoAlreadyExists)
        throw new HttpException('Video Id already exists', HttpStatus.CONFLICT);

      const searchedVideo = await this.youtubeService.getVideoInfo(
        processVideoDto.videoUrl,
      );

      if (!searchedVideo)
        throw new HttpException(
          'Youtube video not found',
          HttpStatus.NOT_FOUND,
        );

      let author = await this.authorService.findOneByUrl(
        searchedVideo.author.channelUrl,
      );

      if (!author) {
        const createAuthorDto = new CreateAuthorDto();
        createAuthorDto.name = searchedVideo.author.name;
        createAuthorDto.channelUrl = searchedVideo.author.channelUrl;
        createAuthorDto.avatar = searchedVideo.author.avatar;
        createAuthorDto.youtubeId = searchedVideo.author.id;
        createAuthorDto.user = searchedVideo.author.user!;
        author = await this.authorService.create(createAuthorDto);
      }

      const createdVideo = await this.videoService.create(user.id, {
        youtubeId: searchedVideo.youtubeId,
        url: processVideoDto.videoUrl,
        title: searchedVideo.title,
        description: searchedVideo.description,
        category: searchedVideo.category,
        thumbnail: searchedVideo.thumbnail,
        uploadDate: searchedVideo.uploadDate,
        durationInSeconds: searchedVideo.durationInSeconds,
        author,
      });

      await this.videoService.scheduleProcessing({
        id: createdVideo.id,
        url: createdVideo.url,
        youtubeId: createdVideo.youtubeId,
      });

      return createdVideo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
