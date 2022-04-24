import { Enum, EnumType } from "ts-jenum";

export enum BeverageType {
  COFFEE = 'COFFEE',
  TEA = 'TEA',
}

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

@Enum('name')
export class Beverage extends EnumType<Beverage>() {
  static readonly ESPRESSO = new Beverage(BeverageType.COFFEE, '에스프레소', 3000, 3);
  static readonly AMERICANO = new Beverage(BeverageType.COFFEE, '아메리카노', 3500, 3.5);
  static readonly CAPPUCCINO = new Beverage(BeverageType.COFFEE, '카푸치노', 4000, 5);
  static readonly LATTE = new Beverage(BeverageType.COFFEE, '라떼', 4000, 5);
  static readonly FLAT_WHITE = new Beverage(BeverageType.COFFEE, '플랫 화이트', 4500, 5);
  static readonly MACCHIATO = new Beverage(BeverageType.COFFEE, '마키아토', 4500, 6);
  static readonly MOCHA = new Beverage(BeverageType.COFFEE, '모카', 4500, 6);

  static readonly BLACK_TEA = new Beverage(BeverageType.TEA, '홍차', 3500, 2);

  private constructor(
    readonly type: BeverageType,
    readonly name: string,
    readonly price: number,
    readonly manufacturingTime: number,
  ) {
    super();
  }

  static toEnum() {
    const _enum = {};

    this.keys().forEach(key => {
      _enum[key] = (Beverage[key] as Beverage).name;
    });
    
    return _enum;
  }

  static findByname(name: string) {
    return this.values()
      .find(value => value.name === name)?.manufacturingTime;
  }

  static toMenu() {
    return this.values();
  }
}