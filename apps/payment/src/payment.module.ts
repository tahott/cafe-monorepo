import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { RedisModule } from '@app/redis';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    RedisModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
