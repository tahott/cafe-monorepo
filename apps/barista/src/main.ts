import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BaristaModule } from './barista.module';

async function bootstrap() {
  const app = await NestFactory.create(BaristaModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'my-cafe',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'cafe-barista',
      },
    }
  });

  await app.startAllMicroservices();

  await app.listen(3002);

  console.log(`Application is running on`);
}
bootstrap();
