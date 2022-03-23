import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY-CAFE-PAYMENT',
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
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
