import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BaristaController } from './barista.controller';
import { BaristaService } from './barista.service';
import { TasksModule } from './tasks/tasks.module';
import { RedisModule } from '@app/redis';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    RedisModule,
  ],
  controllers: [BaristaController],
  providers: [BaristaService],
})
export class BaristaModule {}
