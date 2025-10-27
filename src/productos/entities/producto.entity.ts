import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductoImagen } from './producto-imagen.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToMany(() => ProductoImagen, (imagen) => imagen.producto, {
    cascade: true,
    eager: true,
  })
  imagenes: ProductoImagen[];
  @Column('int')
  stock: number;
}
