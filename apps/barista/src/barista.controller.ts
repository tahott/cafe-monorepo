import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { BaristaService } from './barista.service';

@Controller()
export class BaristaController {
  constructor(
  ) { }

  @MessagePattern('payment')
  recvMsg(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const originMessage = context.getMessage();

    if (JSON.parse(JSON.stringify(originMessage.value)).paymentResult) {
      /**
       * 주문이 리스트에 등록되면 바리스타는 작업에 들어간다
       * 바리스타는 실제로는 사람이지만 이 시스템에서는 바리스타의 행동을
       * 정의하는 서비스를 따로 두어 바리스타의 행동을 나타내기로 한다
       */
      BaristaService.insertOrder(JSON.parse(JSON.stringify(originMessage.value)).order.map(o => ({ name: o.name, amount: o.amount })))
    }
  }
}
