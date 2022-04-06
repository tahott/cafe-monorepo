import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { OrderItemEntity } from './orderItem.entity';

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
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'showmethemoney',
      database: 'cafe',
      entities: [__dirname + '/*.entity.{ts,js}'],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
