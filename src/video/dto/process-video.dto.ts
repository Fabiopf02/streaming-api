import { IsInt, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class ProcessVideoDto {
  @IsNotEmpty()
  @IsUrl()
  videoUrl: string;
}

export class ScheduleProcessingDto {
  @IsInt()
  id: number;

  @IsString()
  @Length(11, 11)
  youtubeId: string;

  @IsUrl()
  url: string;
}
