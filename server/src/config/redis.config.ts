/**
 * Redis 缓存配置
 * 从环境变量读取连接参数，提供默认值
 */
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',       // Redis 主机地址
  port: parseInt(process.env.REDIS_PORT || '6379', 10), // Redis 端口
  password: process.env.REDIS_PASSWORD || undefined,   // Redis 密码（可选）
}));
