import { Body, Controller, Get, Inject, Post, Sse } from '@nestjs/common';
import { ClientKafka, Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { interval, map, Observable } from 'rxjs';
import { LoggerService } from '@app/logger';
import { OrderDto } from './order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('MY-CAFE-ORDER') private readonly client: ClientKafka,
    private readonly logger: LoggerService,
  ) { }
  @Get()
  async menu() {
    return this.orderService.getMenu();
  }

  @Post()
  async order(
    @Body() order: OrderDto,
  ) {
    return await this.orderService.order(order);
  }

  @MessagePattern('payment')
  async recvMsg(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const originMessage = context.getMessage();

    await this.orderService.updatePaymentOrder(originMessage);
  }

  @Sse()
  sse(): Observable<MessageEvent> {
    return interval(3000).pipe(map(() => ({ data: { hello: 'world' } } as MessageEvent)));
  }
}
