import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { LineaPedido } from './linea-pedido.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customerAddress: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;
  @Column({ type: 'boolean', default: false })
  gesendet: boolean;
  @OneToMany(() => LineaPedido, (linea) => linea.pedido, { cascade: true })
  lineas: LineaPedido[];

  @CreateDateColumn()
  createdAt: Date;
}
