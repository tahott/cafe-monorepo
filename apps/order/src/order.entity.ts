import { convert, LocalDateTime, nativeJs } from "@js-joda/core";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, ValueTransformer } from "typeorm";
import { OrderItemEntity } from "./orderItem.entity";

class DateTimeTransformer implements ValueTransformer {
  to(entityValue: LocalDateTime): Date {
    return convert(entityValue).toDate();
  }
  from(dbValue: Date) {
    return LocalDateTime.from(nativeJs(dbValue));
  }
}

@Entity('order')
export class OrderEntity {
  @OneToMany(type => OrderItemEntity, orderItem => orderItem.orderNo)
  @PrimaryColumn({
    type: 'nvarchar', length: 12, nullable: false,
  })
  no: string;

  @Column()
  vendor: string;
  
  @Column({ type: 'varchar', length: 100, nullable: false })
  approvalValue: string;

  @Column({ type: 'bool', nullable: false, default: false })
  payState: boolean;

  @Column({ type: 'bool', nullable: false, default: false })
  takeout: boolean;

  @Column({
    type: 'timestamp',
    transformer: new DateTimeTransformer(),
    nullable: false,
  })
  createdAt: LocalDateTime;

  @Column({
    type: 'timestamp',
    transformer: new DateTimeTransformer(),
    nullable: false,
  })
  updatedAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @BeforeUpdate()
  protected beforeUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  static new(
    vendor: string,
    approvalValue: string,
    takeout: boolean,
  ) {
    const order = new OrderEntity();

    order.vendor = vendor;
    order.approvalValue = approvalValue;
    order.takeout = takeout;
    order.payState = false;

    return order;
  }
}