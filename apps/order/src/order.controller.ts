import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderDto } from './order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('MY-CAFE-ORDER') private readonly client: ClientKafka,
  ) { }
  @Get()
  getHello() {
    return this.orderService.getHello();
  }

  @Post()
  async order(
    @Body() order: OrderDto,
  ) {
    return await this.orderService.order(order);
  }
}
