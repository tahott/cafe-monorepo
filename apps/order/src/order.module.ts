import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { LoggerModule } from '@app/logger';
import { OrderController } from './order.controller';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';
import { OrderItemEntity } from './orderItem.entity';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
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
    RedisModule,
    LoggerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
