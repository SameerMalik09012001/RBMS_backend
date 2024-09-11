import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    // origin: 'https://rbms-frontend.vercel.app',
    origin: 'http://localhost:3000',
    methods: 'GET,POST,DELETE,PUT,get, post, delete, put',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  });

  await app.listen(5000);
}

bootstrap();
