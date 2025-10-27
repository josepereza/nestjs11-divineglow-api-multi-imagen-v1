import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { LineaPedido } from './entities/linea-pedido.entity';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, LineaPedido]), ProductosModule],

  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
