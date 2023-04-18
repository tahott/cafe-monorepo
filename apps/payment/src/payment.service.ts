import { StreamHandlerService } from "@app/redis/stream-handler.service";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PaymentService implements OnModuleInit {
  constructor(
    private readonly streamService: StreamHandlerService,
  ) {}
  async onModuleInit() {
    const generator = this.streamService.getConsumerMessageGenerator({
      streamName: 'order',
      group: 'payment',
      consumer: '1',
      count: 10
    })

    for await (const message of generator) {
      console.log(message)
      
    }
  }

  private async thirdPartyPay() {
    return Math.floor(Math.random() * (11 - 1) + 1) < 9;
  }
}