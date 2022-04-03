import { Beverage, Size } from "@app/menu/beverage";
import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import { Expose, Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsBoolean, IsEnum, IsNotEmpty, IsPositive, IsString, Max, ValidateNested } from "class-validator";
import OrderEntity from './order.entity'

export class Order {
  @IsEnum(Beverage.toEnum())
  name: Beverage;

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

  toEntity(): OrderEntity {
    return OrderEntity.new(
      this.order,
      this.payment.vendor,
      this.payment.approvalValue,
      this.takeout,
    );
  }
}