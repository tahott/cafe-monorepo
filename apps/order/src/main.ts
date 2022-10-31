import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { NewrelicInterceptor } from './newrelic.interceptor';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

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

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  app.useGlobalInterceptors(new NewrelicInterceptor());

  await app.startAllMicroservices();

  await app.listen(3000);

  console.log(`Application is running on: ${ await app.getUrl() }`);
}
bootstrap();
