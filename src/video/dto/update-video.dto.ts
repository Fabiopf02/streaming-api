import { IsEnum, IsInt } from 'class-validator';
import { VideoStatus } from '../enums/video-status.enum';

export class UpdateVideoStatusDto {
  @IsInt()
  id: number;

  @IsEnum(VideoStatus)
  status: VideoStatus;
}
