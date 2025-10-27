import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  IsOptional,
  IsArray,
} from 'class-validator';

export class ProductoImagenDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsArray()
  imagenes?: { imageUrl: string }[];
}
