import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateLineaPedidoDto } from './linea-pedido.dto';

export class CreatePedidoDto {
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsNotEmpty()
  customerAddress: string;
  @IsOptional()
  gesendet: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineaPedidoDto)
  lineas: CreateLineaPedidoDto[];
}
