import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  let corsOptions = {};

  switch (process.env.ENV) {
    case 'local':
      corsOptions = {
        origin: ['http://localhost:3001'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      };
      break;
    case 'prod':
      corsOptions = {
        origin: ['https://callee.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      };
      break;
  }

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
