import { Module, OnModuleInit } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],

  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // 👈 necesario para que otros módulos lo usen
})
export class UsuariosModule implements OnModuleInit {
  constructor(private readonly usuariosService: UsuariosService) {}

  async onModuleInit() {
    await this.usuariosService.seedAdmin();
  }
}
