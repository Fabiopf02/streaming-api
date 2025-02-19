import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/user/user.service';
import { CreateCodeAuth } from './dto/create-code-auth.dto';
import { generateCode } from 'src/utility/code';
import { InternalDate } from 'src/utility/date';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { extractUserName } from 'src/utility/helpers';
import { ValidateCodeAuth } from './dto/validate-code-ath.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async createCode(body: CreateCodeAuth) {
    try {
      const hasSavedUser = await this.usersService.findByEmail(body.email);
      if (
        hasSavedUser?.accessCode &&
        hasSavedUser?.accessCodeExpiration &&
        InternalDate(hasSavedUser.accessCodeExpiration).isAfter(new Date())
      ) {
        return {
          expiration: hasSavedUser.accessCodeExpiration,
        };
      }

      const code = generateCode();
      const expiration = InternalDate(new Date()).addMinutes(10);

      const userData = new CreateUserDto();

      userData.accessCode = code;
      userData.accessCodeExpiration = expiration;
      userData.email = body.email;

      if (hasSavedUser) {
        await this.usersService.updateToAuth(userData);
      } else {
        userData.name = extractUserName(body.email)!;
        await this.usersService.create(userData);
      }

      await this.emailService.sendEmailWithTemplateAuthCode(body.email, {
        code,
        email: body.email,
      });

      return {
        expiration,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'It was not possible to generate the code for authentication',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateCode(body: ValidateCodeAuth) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || !user.accessCodeExpiration) {
      throw new HttpException('Invalid data', HttpStatus.FORBIDDEN);
    }

    if (
      InternalDate(new Date()).isAfter(user.accessCodeExpiration) ||
      user.accessCode !== body.accessCode
    ) {
      throw new HttpException('Invalid access code', HttpStatus.UNAUTHORIZED);
    }

    await this.usersService.updateValidateUser(body.email);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    };
  }
}
