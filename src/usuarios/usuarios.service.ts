import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

  findByUsername(username: string) {
    return this.repo.findOneBy({ username });
  }

  create(user: Partial<Usuario>) {
    const u = this.repo.create(user);
    return this.repo.save(u);
  }

  async seedAdmin() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.create({
        username: 'admin',
        password: 'admin',
        role: 'admin',
      });
    }
  }
}
