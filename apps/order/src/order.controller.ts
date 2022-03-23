import { Body, Controller, Get, Inject, OnModuleDestroy, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka, Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';

class PaymentDto {
  type: string;
  code: string;
}

class OrderDto {
  name: string
  size: string
  amount: number
  payment: PaymentDto
}

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
  order(@Body() order: OrderDto) {
    return this.client.send('order', order);
  }
}
