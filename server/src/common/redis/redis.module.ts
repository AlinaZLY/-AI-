/**
 * Redis 模块
 * 全局模块，提供 RedisService 供所有模块使用
 */
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()  // 标记为全局模块，无需在每个模块中导入
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
