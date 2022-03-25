import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'my-cafe',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'cafe-order',
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.startAllMicroservices();

  await app.listen(3000);

  console.log(`Application is running on: ${ await app.getUrl() }`);
}
bootstrap();
