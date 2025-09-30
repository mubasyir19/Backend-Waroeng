import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hanya field yang ada di DTO
      forbidNonWhitelisted: true, // error kalau ada field tambahan
      transform: true, // otomatis konversi type (string → number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
