import { convert, LocalDateTime, nativeJs } from "@js-joda/core";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from "typeorm";
import { OrderItem } from "./order.dto";
import { OrderEntity } from "./order.entity";

class DateTimeTransformer implements ValueTransformer {
  to(entityValue: LocalDateTime): Date {
    return convert(entityValue).toDate();
  }
  from(dbValue: Date) {
    return LocalDateTime.from(nativeJs(dbValue));
  }
}

@Entity('order_item')
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(type => OrderEntity, order => order.no)
  @JoinColumn({ referencedColumnName: 'no' })
  orderNo: string;

  @Column({ type: 'nvarchar', length: 40, nullable: false })
  menu: string;

  @Column({ type: 'tinyint', nullable: false })
  amount: number;

  @Column({ type: 'mediumint', nullable: false })
  price: number;

  @Column({
    type: 'timestamp',
    transformer: new DateTimeTransformer(),
    nullable: false,
  })
  createdAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdAt = LocalDateTime.now();
  }

  static new(
    item: OrderItem
  ) {
    const orderItem = new OrderItemEntity();
    orderItem.menu = JSON.stringify(item.name)
    orderItem.amount = item.amount;
    orderItem.price = item.price;

    return orderItem;
  }
}