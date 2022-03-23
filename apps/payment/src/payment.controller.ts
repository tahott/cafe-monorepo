import { Controller, Get, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';


@Controller()
export class PaymentController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('MY-CAFE-PAYMENT') private readonly client: ClientKafka,
  ) { }
  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @MessagePattern('order')
  async recvMsg(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const originMessage = context.getMessage();

    const paymentResult = await this.thirdPartyPay();

    const res = Object.assign(originMessage.value, { paymentResult });

    this.client.emit('payment', res);

    return res;
  }

  private async thirdPartyPay() {
    return Math.floor(Math.random() * (11 - 1) + 1) < 9;
  }
}
