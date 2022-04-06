import { convert, LocalDate, LocalDateTime } from '@js-joda/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>
  ) {

  }
  getHello(): string {
    return 'Hello World!';
  }

  async insertOrder(order: OrderEntity, items: OrderItemEntity[]) {
    const now = LocalDate.now();
    order.no = `${now.year()}${now.monthValue().toString().padStart(2, '0')}${now.dayOfMonth().toString().padStart(2, '0')}${await (await this.getOrderNo()).padStart(4, '0')}`;
    
    await this.orderRepository.insert(order);
    await this.orderItemRepository.insert(items.map(item => {
      item.orderNo = order.no;
      return item;
    }));
    return order;
  }

  private async getOrderNo(): Promise<string> {
    const fromDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
    const toDate = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(0);

    const count = await createQueryBuilder(OrderEntity)
      .select()
      .where('created_at BETWEEN :fromDate AND :toDate', { fromDate: convert(fromDate).toDate(), toDate: convert(toDate).toDate() })
      .getCount()

    return count.toString();
  }
}
