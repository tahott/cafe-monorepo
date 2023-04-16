import { FactoryProvider } from "@nestjs/common";
import { REDIS_CLIENT, RedisClient } from "./redis-client.type";
import { createClient } from "redis";

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({ url: 'redis://localhost:6379/0' })
    await client.connect();
    return client;
  },
}