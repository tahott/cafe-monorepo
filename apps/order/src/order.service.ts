import { Beverage } from '@app/menu/beverage';
import { convert, LocalDateTime } from '@js-joda/core';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { MenuResponseDto, OrderDto, OrderResponseDto } from './order.dto';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './orderItem.entity';

@Injectable()
export class OrderService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
    @Inject('MY-CAFE-ORDER') private readonly client: ClientKafka,
  ) {}
  async onModuleInit() {
    this.client.subscribeToResponseOf('order');
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  getMenu(): MenuResponseDto[] {
    return Beverage.toMenu().map(menu => new MenuResponseDto(menu));
  }

  async order(order: OrderDto) {
    // insert pre-order
    const preOrder = await this.insertOrder(order.toOrderEntity(), order.toOrderItemEntity());

    // send payment
    return await this.sendPayment(new OrderResponseDto(order, preOrder.no.slice(-4)));
  }

  async updatePaymentOrder(originMessage: KafkaMessage) {
    const orderResult = JSON.parse(JSON.stringify(originMessage.value));
    const now = LocalDateTime.now();
    const orderNo = `${now.year()}${now.monthValue().toString().padStart(2, '0')}${now.dayOfMonth().toString().padStart(2, '0')}${orderResult.orderNo}`;

    orderResult.paymentResult
      ? await this.updateOrder(orderNo, true)
      : await this.updateOrder(orderNo, false)
  }

  private async sendPayment(order: OrderResponseDto) {
    return await this.client.send('order', JSON.parse(JSON.stringify(order)));
  }

  private async insertOrder(order: OrderEntity, items: OrderItemEntity[]) {
    const now = LocalDateTime.now();
    order.no = `${now.year()}${now.monthValue().toString().padStart(2, '0')}${now.dayOfMonth().toString().padStart(2, '0')}${await (await this.getOrderNo()).padStart(4, '0')}`;

    await this.orderRepository.insert(order);
    await this.orderItemRepository.insert(items.map(item => {
      item.orderNo = order.no;
      return item;
    }));

    return order;
  }

  private async updateOrder(orderNo: string, payState: boolean = false) {
    console.log(orderNo, payState);
    payState
      ? await this.orderRepository.update({ no: orderNo }, { payState: true, updatedAt: LocalDateTime.now() })
      : await this.orderRepository.update({ no: orderNo }, { canceledAt: LocalDateTime.now() });
  }

  private async getOrderNo(): Promise<string> {
    const fromDate = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
    const toDate = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(0);

    const count = await createQueryBuilder(OrderEntity)
      .select()
      .where('created_at BETWEEN :fromDate AND :toDate', { fromDate: convert(fromDate).toDate(), toDate: convert(toDate).toDate() })
      .getCount();

    return (count + 1).toString();
  }
}
