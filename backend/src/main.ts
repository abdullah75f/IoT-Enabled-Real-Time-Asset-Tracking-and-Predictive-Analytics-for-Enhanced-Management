import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS globally
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payload to DTO types
      whitelist: true, // Automatically strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throws an error if properties are not defined in DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
