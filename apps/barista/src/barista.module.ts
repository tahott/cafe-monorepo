import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BaristaController } from './barista.controller';
import { BaristaService } from './barista.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [BaristaController],
  providers: [BaristaService],
})
export class BaristaModule {}
