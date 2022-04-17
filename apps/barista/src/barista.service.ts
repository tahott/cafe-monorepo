type MenuList = {
  name: string,
  amount: number,
}

export class BaristaService {
  static #list: Array<{ menu: Array<MenuList>, orderNo: string }> = [];
  static #pickUpList: Array<string> = [];
  static #isMaking = false;

  constructor() { }

  static insertOrder(menu: Array<MenuList>, orderNo: string) {
    this.#list.push({ menu, orderNo });
  }

  static shiftOrder() {
    return this.#list.shift();
  }

  static insertPickUpOrder(orderNo: string) {
    this.#pickUpList.push(orderNo);
  }

  static shiftPickUpOrder() {
    const orders = this.#pickUpList;
    this.#pickUpList = [];
    return orders;
  }

  static currentBaristaWorkState() {
    return this.#isMaking;
  }

  static getOrderList() {
    return this.#list;
  }

  static setWorkBarista() {
    this.#isMaking = !this.#isMaking;
  }
}