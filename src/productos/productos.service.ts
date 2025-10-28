import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProductoDto,
  ProductoImagenDto,
} from './dto/create-producto.dto';
import { Producto } from './entities/producto.entity';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoImagen } from './entities/producto-imagen.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(ProductoImagen)
    private imagenRepository: Repository<ProductoImagen>,
  ) {}

  findAll() {
    return this.productoRepository.find();
  }

  findOne(id: number) {
    return this.productoRepository.findOneBy({ id });
  }

  async create(
    createProductoDto: CreateProductoDto,
    imagenes: { imageUrl: string }[],
  ) {
    const producto = this.productoRepository.create(createProductoDto);

    producto.imagenes = imagenes.map((img) =>
      this.imagenRepository.create({ imageUrl: img.imageUrl }),
    );

    return await this.productoRepository.save(producto);
  }

  /*  update(id: number, updateProductoDto: UpdateProductoDto) {
    return this.productoRepository.update({ id }, { ...updateProductoDto });
  }
 */
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepository.preload({
      id,
      ...updateProductoDto,
    });

    if (!producto) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }

    return this.productoRepository.save(producto);
  }

  remove(id: number) {
    return this.productoRepository.delete({ id });
  }

  async seedProducts() {
    const count = await this.productoRepository.count();
    if (count === 0) {
      const initialProducts = [
        {
          id: 1,
          name: 'Rosa Perlen Tasche L',
          description: 'Ein lebhaftes und feminines Design...',
          price: 89.0,
          stock: 10,
          imagenes: [{ imageUrl: 'rosa.jpeg' }],
        },
        {
          id: 2,
          name: 'Weisse Perlen Tasche M',
          description: 'Zeitlose Eleganz...',
          price: 69.0,
          stock: 15,
          imagenes: [{ imageUrl: 'weiss.jpeg' }],
        },
        {
          id: 3,
          name: "Mini-Tasche 'AirPods Schutzülle rosa'",
          description: 'Klein, aber oho!...',
          price: 39.0,
          stock: 20,
          imagenes: [{ imageUrl: 'airpods.jpeg' }],
        },
      ];
      await this.productoRepository.save(initialProducts);
      console.log('Seed inicial de productos insertado ✅');
    }
  }

  async decreaseStock(productoId: number, cantidad: number) {
    const producto = await this.productoRepository.findOneBy({
      id: productoId,
    });
    if (!producto)
      throw new BadRequestException(`Producto ${productoId} no existe`);
    if (producto.stock - cantidad < 0) {
      throw new BadRequestException(
        `Stock insuficiente para producto ${productoId}`,
      );
    }
    producto.stock = producto.stock - cantidad;
    await this.productoRepository.save(producto);
    return producto;
  }
  async addImagen(productoId: number, imageUrl: string) {
    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) throw new Error('Producto no encontrado');

    const imagen = this.imagenRepository.create({ imageUrl, producto });
    return await this.imagenRepository.save(imagen);
  }
}
