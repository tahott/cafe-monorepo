import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Order as OrderDto } from "./order.dto";

@Entity()
class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: string;

  @Column()
  vendor: string;
  
  @Column()
  approvalValue: string;

  @Column()
  takeout: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  static new(
    orderDto: OrderDto[],
    vendor: string,
    approvalValue: string,
    takeout: boolean,
  ) {
    const order = new Orders();

    order.order = JSON.stringify(orderDto);
    order.vendor = vendor;
    order.approvalValue = approvalValue;
    order.takeout = takeout;
    order.createdAt = new Date();
    order.updatedAt = order.createdAt;

    return order;
  }
}

export default Orders;