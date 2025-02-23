import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    const author = await this.authorService.findOneById(+id);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('name/:name')
  async findOneByName(@Param('name') name: string) {
    const author = await this.authorService.findOneByName(name);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('youtube/:youtubeId')
  async findOneByYoutubeId(@Param('youtubeId') youtubeId: string) {
    const author = await this.authorService.findOneByYoutubeId(youtubeId);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Get('url/:url')
  async findOneByUrl(@Param('url') url: string) {
    const author = await this.authorService.findOneByUrl(url);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }
}
