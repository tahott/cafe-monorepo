import { createQueryBuilder, EntityRepository, Repository } from "typeorm";
import { OrderEntity } from "./order.entity";

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  async insertOrder() {
    createQueryBuilder()
  }
}