import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BaristaModule } from './barista.module';

async function bootstrap() {
  const app = await NestFactory.create(BaristaModule);

  app.enableCors();

  await app.listen(3002);

  console.log(`Application is running on`);
}
bootstrap();
