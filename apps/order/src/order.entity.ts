import { convert, LocalDateTime, nativeJs } from "@js-joda/core";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, ValueTransformer } from "typeorm";
import { OrderItemEntity } from "./orderItem.entity";

class DateTimeTransformer implements ValueTransformer {
  to(entityValue: LocalDateTime): Date | null {
    console.log(entityValue)
    if (!entityValue) {
      return null;
    }
    return convert(entityValue).toDate();
  }
  from(dbValue: Date) {
    return LocalDateTime.from(nativeJs(dbValue));
  }
}

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(type => OrderItemEntity, orderItem => orderItem.orderNo)
  @Column({ type: 'nvarchar', length: 12, nullable: false, unique: true })
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
  createdAt: LocalDateTime | Date;

  @Column({
    type: 'timestamp',
    transformer: new DateTimeTransformer(),
    nullable: false,
  })
  updatedAt: LocalDateTime | Date;

  @Column({
    type: 'timestamp',
    transformer: new DateTimeTransformer(),
    nullable: true,
  })
  canceledAt: LocalDateTime;

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