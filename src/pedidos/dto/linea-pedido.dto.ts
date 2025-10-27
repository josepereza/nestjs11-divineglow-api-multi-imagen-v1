import { IsInt, Min } from 'class-validator';

export class CreateLineaPedidoDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}
