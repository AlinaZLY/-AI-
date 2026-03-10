/**
 * 根模块
 * 负责导入所有子模块，配置数据库连接和环境变量
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './common/redis/redis.module';
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    // 加载 .env 环境变量，设置为全局可用
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, redisConfig],
    }),

    // TypeORM 异步注册，从 ConfigService 读取数据库配置
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],  // 自动扫描所有实体文件
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // 开发环境自动同步表结构，生产环境禁用
        charset: 'utf8mb4',  // 支持中文和 emoji
      }),
    }),

    // 业务模块
    RedisModule,  // Redis 缓存（全局模块）
    AuthModule,   // 认证模块（注册/登录）
    UserModule,   // 用户模块（个人资料管理）
  ],
})
export class AppModule {}
