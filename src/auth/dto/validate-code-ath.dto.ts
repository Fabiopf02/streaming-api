import { IsEmail, IsString, Length } from 'class-validator';

export class ValidateCodeAuth {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  accessCode: string;
}
