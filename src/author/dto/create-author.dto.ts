import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(24, 24)
  youtubeId: string;

  @IsNotEmpty()
  @IsUrl()
  channelUrl: string;

  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  user: string;
}
