import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException('No token');
    const parts = auth.split(' ');
    if (parts.length !== 2) throw new UnauthorizedException('Formato inválido');
    const token = parts[1];
    try {
      const payload = this.authService.verifyToken(token);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
