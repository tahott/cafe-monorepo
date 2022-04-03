import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import Order from './order.entity';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'showmethemoney',
      database: 'cafe',
      entities: [__dirname + '/order.entity.{ts,js}'],
      synchronize: true,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
