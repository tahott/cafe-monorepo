import { Beverage } from "@app/menu/beverage";
import { LocalDateTime } from "@js-joda/core";
import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { BaristaService } from "../barista.service";

@Injectable()
export class TasksService {
  constructor() { }
  
  @Interval(3000)
  async handleInterval() {
    if (BaristaService.getOrderList().length > 0
      && !BaristaService.currentBaristaWorkState()
    ) {
      BaristaService.setWorkBarista();
      const list = BaristaService.shiftOrder();

      console.log(
        `Beverage make started at ${LocalDateTime.now()}`
      );

      for await (const menu of list.menu) {
        await this.delay(Beverage.findByname(menu.name) * 1000 * menu.amount);
      }

      BaristaService.setWorkBarista();

      console.log(
        `Beverage make completed at ${LocalDateTime.now()}`
      );
      /**
       * 하나의 오더가 완료 되었을 때, 픽업 알림을 보낸다
       * How?
       *  - 완료 된 주문을 픽업 리스트에 등록한다
       *  - SSE에서 완료 된 메뉴가 있으면 클라이언트에 보내준다
       */
      BaristaService.insertPickUpOrder(list.orderNo);
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}