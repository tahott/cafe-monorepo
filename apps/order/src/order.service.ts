import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Order from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {

  }
  getHello(): string {
    return 'Hello World!';
  }

  insertOrder(order: Order) {
    this.orderRepository.insert(order);
    return order;
  }
}
