import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorRepository.save(createAuthorDto);
  }

  async findAll() {
    return this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.videos', 'videos')
      .select([
        'author.*',
        'CAST(COUNT(videos.id) AS integer) as videos',
        'CAST(SUM(videos.durationInSeconds) AS integer) as time',
      ])
      .addOrderBy('author.name', 'ASC')
      .addGroupBy('author.id')
      .getRawMany();
  }

  findOneById(id: number) {
    return this.authorRepository.findOneBy({ id });
  }

  findOneByYoutubeId(youtubeId: string) {
    return this.authorRepository.findOneBy({ youtubeId });
  }

  findOneByName(name: string) {
    return this.authorRepository.findOneBy({ name });
  }

  findOneByUrl(url: string) {
    return this.authorRepository.findOneBy({ channelUrl: url });
  }
}
