type MenuList = {
  name: string,
  amount: number,
}

export class BaristaService {
  static #list: Array<Array<MenuList>> = [];
  static #isMaking = false;

  constructor() { }

  static insertOrder(menu: Array<MenuList>) {
    this.#list.push(menu);
  }

  static shiftOrder() {
    return this.#list.shift();
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