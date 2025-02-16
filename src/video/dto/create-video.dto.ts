import { IsDefined, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Author } from 'src/author/entities/author.entity';

export class CreateVideoDto {
  @IsString()
  youtubeId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  url: string;

  @IsInt()
  durationInSeconds: number;

  @IsString()
  category: string;

  @IsString()
  uploadDate: string;

  @IsOptional()
  @IsUrl()
  thumbnail: string;

  @IsDefined()
  author: Author;
}
