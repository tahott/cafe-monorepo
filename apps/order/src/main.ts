import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NewrelicInterceptor } from './newrelic.interceptor';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);

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
