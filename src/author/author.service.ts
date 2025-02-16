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

  findAll() {
    return this.authorRepository.find();
  }

  findOneById(id: number) {
    return this.authorRepository.findOneBy({ id });
  }

  findOneByName(name: string) {
    return this.authorRepository.findOneBy({ name });
  }

  findOneByUrl(url: string) {
    return this.authorRepository.findOneBy({ channelUrl: url });
  }
}
