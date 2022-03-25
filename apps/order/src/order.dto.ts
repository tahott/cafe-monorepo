import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsBoolean, IsEnum, IsNotEmpty, IsPositive, IsString, Max, ValidateNested } from "class-validator";
import { Enum, EnumType } from "ts-jenum";

@Enum<Menu>('name')
class Menu extends EnumType<Menu>() {
  static readonly AMERICANO = new Menu('아메리카노');
  static readonly CAFELATTE = new Menu('카페라떼');

  private constructor(
    readonly name: string,
  ) {
    super();
  }

  static toEnum() {
    const _enum = {};

    this.keys().forEach(key => {
      _enum[key] = (Menu[key] as Menu).name;
    })

    return _enum;
  }
}

enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

class Order {
  @IsEnum(Menu.toEnum())
  name: Menu;

  @Transform((property) => property.value.toLowerCase())
  @IsEnum(Size)
  size: Size;

  @Max(99)
  @IsPositive()
  amount: number;
  
  @IsPositive()
  price: number;
}

class Payment {
  @IsNotEmpty()
  @IsString()
  vendor: string;

  @IsNotEmpty()
  @IsString()
  approvalValue: string;
}

export class OrderRequest {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Order)
  order: Order[];

  @Expose()
  @ValidateNested()
  @Type(() => Payment)
  payment: Payment;

  @Expose()
  @IsBoolean()
  takeout: boolean;

  @Expose()
  @Transform(() => LocalDateTime.parse(LocalDateTime.now().toString()).format(DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss.SSS')))
  orderCreatedAt: LocalDateTime;
}