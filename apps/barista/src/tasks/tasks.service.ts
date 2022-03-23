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
      const menu = BaristaService.shiftOrder();

      switch (menu) {
        case 'americano':
          await this.delay(3000);
          break;
        case 'latte':
          await this.delay(5000);
          break;
        default:
          break;
      }

      BaristaService.setWorkBarista();
      console.log(
        `Order completed... ${menu}. ${new Date()}`
      )
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}