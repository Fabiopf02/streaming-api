import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(45)
  name: string;

  @IsEmail()
  @Length(10, 45)
  email: string;

  @IsString()
  @Length(6, 6)
  accessCode: string;

  @IsDate()
  accessCodeExpiration: Date;
}
