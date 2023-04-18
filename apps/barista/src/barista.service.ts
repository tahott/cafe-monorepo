import { StreamHandlerService } from "@app/redis/stream-handler.service";
import { Injectable, OnModuleInit } from "@nestjs/common";

type MenuList = {
  name: string,
  amount: number,
}

@Injectable()
export class BaristaService implements OnModuleInit {
  static list: Array<{ menu: Array<MenuList>, orderNo: string }> = [];
  static pickUpList: Array<string> = [];
  static isMaking = false;

  constructor(private readonly streamService: StreamHandlerService,) { }

  async onModuleInit() {
    console.log(await this.streamService.ping());
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

  static insertOrder(menu: Array<MenuList>, orderNo: string) {
    this.list.push({ menu, orderNo });
  }

  static shiftOrder() {
    return this.list.shift();
  }

  static insertPickUpOrder(orderNo: string) {
    this.pickUpList.push(orderNo);
  }

  static shiftPickUpOrder() {
    const orders = this.pickUpList;
    this.pickUpList = [];
    return orders;
  }

  static currentBaristaWorkState() {
    return this.isMaking;
  }

  static getOrderList() {
    return this.list;
  }

  static setWorkBarista() {
    this.isMaking = !this.isMaking;
  }
}