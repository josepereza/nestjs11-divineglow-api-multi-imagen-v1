import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.enableCors();
  // Habilita la validación global de DTOs usando class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
      transform: true, // Transforma los objetos de entrada a instancias del DTO
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos (ej: string a number para @Param)
      },
    }),
  );
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server listening on http://localhost:${port}`);
}
void bootstrap();
