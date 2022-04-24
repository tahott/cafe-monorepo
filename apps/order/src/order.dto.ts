import { Beverage, BeverageType, Size } from "@app/menu/beverage";
import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsBoolean, IsEnum, IsNotEmpty, IsPositive, IsString, Max, ValidateNested } from "class-validator";
import { OrderEntity } from './order.entity'
import { OrderItemEntity } from "./orderItem.entity";

export class OrderItem {
  @IsEnum(Beverage.toEnum())
  name: string;

  @Transform((property) => property.value.toLowerCase())
  @IsEnum(Size)
  size: Size;

  @Max(99)
  @IsPositive()
  amount: number;
  
  @IsPositive()
  price: number;
}

export class Payment {
  @IsNotEmpty()
  @IsString()
  vendor: string;

  @IsNotEmpty()
  @IsString()
  approvalValue: string;
}

export class OrderDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  order: OrderItem[];

  @Expose()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Payment)
  payment: Payment;

  @Expose()
  @IsBoolean()
  takeout: boolean;

  @Expose()
  @Transform(() => LocalDateTime.parse(LocalDateTime.now().toString()).format(DateTimeFormatter.ofPattern('yyyy-MM-dd HH:mm:ss.SSS')))
  orderCreatedAt: LocalDateTime;

  toOrderEntity(): OrderEntity {
    return OrderEntity.new(
      this.payment.vendor,
      this.payment.approvalValue,
      this.takeout,
    );
  }

  toOrderItemEntity(): OrderItemEntity[] {
    return this.order.map((item) => {
      return OrderItemEntity.new(item);
    })
  }
}

export class OrderResponseDto {
  @Expose() order: OrderItem[];
  @Expose() takeout: boolean;
  @Expose() orderCreatedAt: LocalDateTime;
  @Expose() orderNo: string;

  constructor(order: OrderDto, orderNo: string) {
    this.order = order.order;
    this.takeout = order.takeout;
    this.orderNo = orderNo;
    this.orderCreatedAt = order.orderCreatedAt;
  }
}

export class MenuResponseDto {
  @Expose() type: BeverageType;
  @Expose() name: string;
  @Expose() price: number;

  constructor(beverage: Beverage) {
    this.type = beverage.type;
    this.name = beverage.name;
    this.price = beverage.price;
  }
}