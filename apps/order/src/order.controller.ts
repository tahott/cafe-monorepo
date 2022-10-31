import { Beverage } from '@app/menu/beverage';
import { Body, Controller, Get, Inject, Logger, Post, Sse } from '@nestjs/common';
import { ClientKafka, Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { interval, map, Observable } from 'rxjs';
import { OrderDto } from './order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('MY-CAFE-ORDER') private readonly client: ClientKafka,
    private readonly logger: PinoLogger,
  ) { }
  @Get()
  async menu() {
    this.logger.info('api call');
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
