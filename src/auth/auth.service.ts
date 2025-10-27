import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usuariosService: UsuariosService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usuariosService.findByUsername(username);
    if (user && user.password === password) return user;
    return null;
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
    });
    return { access_token: token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
