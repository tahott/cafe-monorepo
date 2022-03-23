import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'my-cafe',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'cafe-payment',
      },
    },
  });

  await app.startAllMicroservices();

  console.log(`Application is running on`);
}
bootstrap();
