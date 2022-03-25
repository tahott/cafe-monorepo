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

      for await (const menu of list) {
        switch (menu.name) {
          case '아메리카노':
            await this.delay(3000 * menu.amount);
            break;
          case '카페라떼':
            await this.delay(5000 * menu.amount);
            break;
          default:
            break;
        }
      }

      BaristaService.setWorkBarista();

      console.log(
        `Beverage make completed at ${LocalDateTime.now()}`
      );
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}