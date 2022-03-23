import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY-CAFE-ORDER',
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
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
