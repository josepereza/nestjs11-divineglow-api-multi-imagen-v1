import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const [type, token] = authHeader.split(' ');
    if (!token) throw new UnauthorizedException('No token');
    try {
      const payload = this.authService.verifyToken(token);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
