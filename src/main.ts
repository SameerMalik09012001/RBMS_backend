import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your client's URL
    methods: 'GET,POST,DELETE,PUT', // Specify the allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Specify the allowed headers
    credentials: true
  });

  await app.listen(5000);
}

bootstrap();
