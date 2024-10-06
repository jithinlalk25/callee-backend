import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  if (process.env.ENV == 'local') {
    app.enableCors({
      origin: ['http://localhost:3001'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Allow credentials (cookies, etc.) if needed
    });
  }

  await app.listen(3000);
}
bootstrap();
