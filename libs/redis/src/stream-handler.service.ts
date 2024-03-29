import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { AsyncRedisStreamGenerator, RedisStreamMessage } from "./redis-client.type";
import { ReadConsumerGroupParams } from "./interfaces";

@Injectable()
export class StreamHandlerService implements OnModuleDestroy {
  #isAlive = true;
  readonly #DEFAULT_IDLE_TIME_MS = 5000;

  constructor(
    private readonly redisService: RedisService,
  ) {}

  onModuleDestroy() {
    this.#isAlive = false;
  }

  ping() {
    return this.redisService.ping();
  }

  addToStream(fieldsToStore: Record<string, any>, streamName: string) {
    return this.redisService.addToStream({ fieldsToStore, streamName });
  }

  /**
   * Creating generator that will read from stream
   * Utilizing generator lazy evaluation to only fetch data when needed
   */
  async *getStreamMessageGenerator(
    streamName: string,
    count: number,
  ): AsyncRedisStreamGenerator {
    // Start with latest data
    let lastMessageId = '$';
    while (this.#isAlive) {
      const response = await this.redisService.readStream({
        streamName,
        blockMs: 0, // 0 = infinite blocking until at least one message is fetched, or timeout happens
        count, // max how many messages to fetch at a time
        lastMessageId,
      });

      // If no messages returned, continue to next iteration without yielding
      if (!response || response.length === 0) {
        continue;
      }
      // Update last message id to be the last message returned from redis
      lastMessageId = response[response.length - 1].id;
      for (const message of response) {
        yield message;
      }
    }
  }

  /**
   * Creating generator that will read from consumer group
   * We will use auto claim feature to automatically claim messages that are idle for a certain amount of time
   */
  public async *getConsumerMessageGenerator({
    streamName,
    group,
    consumer,
    count,
    autoClaimMinIdleTimeMs,
    autoAck = true,
  }: ReadConsumerGroupParams): AsyncRedisStreamGenerator {
    let fetchNewMessages = true; // Toggle for switching between fetching new messages and auto claiming messages
    while (this.#isAlive) {
      let response: RedisStreamMessage[];
      if (fetchNewMessages) {
        response = await this.redisService.readConsumerGroup({
          streamName,
          group,
          consumer,
          blockMs: 0, // 0 = infinite blocking until at least one message is fetched, or timeout happens
          count,
        });
      } else {
        // Try to auto claim messages that are idle for a certain amount of time
        response = await this.redisService.autoClaimMessage({
          streamName,
          group,
          consumer,
          count,
          minIdleTimeMs:
            autoClaimMinIdleTimeMs || this.#DEFAULT_IDLE_TIME_MS,
        });
      }

      // Acknowledge messages if autoAck is enabled
      if (autoAck && response?.length > 0) {
        await this.redisService.acknowledgeMessages({
          streamName,
          group,
          messageIds: response.map((m) => m.id),
        });
      }

      // Toggle between fetching new messages and auto claiming messages
      fetchNewMessages = !fetchNewMessages;

      // If no messages returned, continue to next iteration without yielding
      if (!response || response.length === 0) {
        continue;
      }
      for (const message of response) {
        yield message;
      }
    }
  }
}