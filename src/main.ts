import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Ao adicionar a linha abaixo, será necessários
  // as bibliotecas: npm i class-validator class-transformer
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove chaves que não estão no DTO -> Segurança
      forbidNonWhitelisted: true, // retorna erro se chaves nao estiverem no DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
