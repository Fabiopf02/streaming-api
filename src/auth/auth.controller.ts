import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCodeAuth } from './dto/create-code-auth.dto';
import { ValidateCodeAuth } from './dto/validate-code-ath.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('/request-code')
  async code(@Body() body: CreateCodeAuth) {
    const response = await this.authService.createCode(body);
    return {
      message: 'A access code was sent to your email',
      expiration: response.expiration,
    };
  }

  @Post('/validate-code')
  validateCode(@Body() body: ValidateCodeAuth) {
    return this.authService.validateCode(body);
  }
}
