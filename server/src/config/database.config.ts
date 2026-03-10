/**
 * MySQL 数据库配置
 * 从环境变量读取连接参数，提供默认值
 */
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',       // 数据库主机地址
  port: parseInt(process.env.DB_PORT, 10) || 3306, // 数据库端口
  username: process.env.DB_USERNAME || 'root',     // 数据库用户名
  password: process.env.DB_PASSWORD || '',          // 数据库密码
  database: process.env.DB_DATABASE || 'campus_recruitment', // 数据库名
}));
