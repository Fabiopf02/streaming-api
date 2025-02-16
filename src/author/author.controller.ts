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
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @UsePipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    const author = await this.authorService.findOneById(+id);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }

  @Get('name/:name')
  async findOneByName(@Param('name') name: string) {
    const author = await this.authorService.findOneByName(name);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }

  @Get('url/:url')
  async findOneByUrl(@Param('url') url: string) {
    const author = await this.authorService.findOneByUrl(url);
    if (author) return author;
    throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
  }
}
