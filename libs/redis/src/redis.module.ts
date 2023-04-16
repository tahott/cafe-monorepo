import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisClientFactory } from './redis-client.factory';
import { StreamHandlerService } from './stream-handler.service';

@Module({
  providers: [redisClientFactory, RedisService, StreamHandlerService],
  exports: [StreamHandlerService, RedisService],
})
export class RedisModule {}
