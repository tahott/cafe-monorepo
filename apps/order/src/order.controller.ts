import { Body, Controller, Get, Inject, OnModuleDestroy, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderRequest } from './order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly orderService: OrderService,
    @Inject('MY-CAFE-ORDER') private readonly client: ClientKafka,
  ) { }
  async onModuleInit() {
    this.client.subscribeToResponseOf('order');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get()
  getHello() {
    return this.orderService.getHello();
  }

  @Post()
  order(@Body() order: OrderRequest) {
    return this.client.send('order', JSON.parse(JSON.stringify(order)));
  }
}
