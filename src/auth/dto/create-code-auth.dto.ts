import { IsEmail } from 'class-validator';

export class CreateCodeAuth {
  @IsEmail()
  email: string;
}
