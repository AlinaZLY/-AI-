/**
 * Redis 服务
 * 封装 Redis 常用操作，用于缓存、会话管理等
 */
import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
    });
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      this.logger.log('Redis 连接成功');
    } catch (error) {
      this.logger.error('Redis 连接失败', (error as Error).message);
    }
    this.client.on('error', (err) => {
      this.logger.error('Redis 错误', err.message);
    });
  }

  /** 设置缓存（支持过期时间，单位秒） */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  /** 获取缓存 */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /** 删除缓存 */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /** 检查 key 是否存在 */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /** 设置过期时间（秒） */
  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  /** 模块销毁时断开 Redis 连接 */
  onModuleDestroy() {
    this.client.disconnect();
  }
}
