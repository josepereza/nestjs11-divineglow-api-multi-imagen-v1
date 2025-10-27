import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { extname } from 'path';

import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Request } from 'express';
// Importa StorageEngine de multer
export const mapFilesToImages = (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) return [];

  return files.map((file) => ({
    imageUrl: `/${file.path}`,
  }));
};
@Controller('productos')
export class ProductosController {
  public imagenes2 = [];
  nombreImagen = '';
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // simple route placeholder; puedes extender
    return this.productosService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  // -------------------------
  // Subir imagen a un producto
  // -------------------------
  // Define el motor de almacenamiento fuera del interceptor

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      //fileFilter: fileExtensionFilter,
      storage: diskStorage({
        destination: './uploads',
        filename: function (
          req: Express.Request,
          file: Express.Multer.File,
          cb,
        ) {
          //const body = req.body as { nombre: string };
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const imagenes = mapFilesToImages(files);
    return this.productosService.create(createProductoDto, imagenes);
  }
}
