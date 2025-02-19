import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isString } from 'class-validator';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.getToken(request.headers.authorization as string);
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.headers.user = payload;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  protected getToken(authHeader: string) {
    if (!authHeader || !isString(authHeader)) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const [, token] = authHeader.split(' ');

    return token;
  }
}
