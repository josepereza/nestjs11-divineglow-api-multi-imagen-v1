import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ProductosService } from '../productos/productos.service';
import { Pedido } from './entities/pedido.entity';
import { LineaPedido } from './entities/linea-pedido.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(LineaPedido)
    private lineaRepository: Repository<LineaPedido>,
    private productosService: ProductosService,
    private dataSource: DataSource,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    return this.dataSource.transaction(async (manager) => {
      let total = 0;

      // Validar y calcular total
      for (const l of createPedidoDto.lineas) {
        const producto = await manager.findOneBy(Producto, {
          id: l.productoId,
        });

        if (!producto) {
          throw new BadRequestException(`Producto ${l.productoId} no existe`);
        }

        if (producto.stock - l.cantidad < 0) {
          throw new BadRequestException(
            `Stock insuficiente para producto ${l.productoId}`,
          );
        }

        total += Number(producto.price) * l.cantidad;
      }
      // Reducir stock
      for (const l of createPedidoDto.lineas) {
        const producto = await manager.findOneBy(Producto, {
          id: l.productoId,
        });

        if (!producto) {
          throw new BadRequestException(`Producto ${l.productoId} no existe`);
        }

        producto.stock -= l.cantidad;
        await manager.save(Producto, producto);
      }

      // Crear pedido con totalAmount
      const pedido = this.pedidoRepository.create({
        customerName: createPedidoDto.customerName,
        customerEmail: createPedidoDto.customerEmail,
        customerAddress: createPedidoDto.customerAddress,
        totalAmount: total,
      });

      const savedPedido = await manager.save(Pedido, pedido);

      for (const l of createPedidoDto.lineas) {
        const linea = this.lineaRepository.create({
          pedidoId: savedPedido.id,
          productoId: l.productoId,
          cantidad: l.cantidad,
        });
        await manager.save(LineaPedido, linea);
      }

      return { success: true, pedidoId: savedPedido.id, totalAmount: total };
    });
  }

  findAll() {
    return this.pedidoRepository.find({
      order: { createdAt: 'DESC' }, // opcional, ordenar por fecha
      relations: ['lineas', 'lineas.producto'], // ⚡ importante para que incluya productos
    });
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoRepository.update({ id }, { ...updatePedidoDto });
  }
}
