/**
 * 根模块
 * 负责导入所有子模块，配置数据库连接和环境变量
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SystemModule } from './modules/system/system.module';
import { CommunityModule } from './modules/community/community.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ApplicationModule } from './modules/application/application.module';
import { ResumeModule } from './modules/resume/resume.module';
import { InterviewModule } from './modules/interview/interview.module';
import { JobModule } from './modules/job/job.module';
import { CompanyModule } from './modules/company/company.module';
import { RedisModule } from './common/redis/redis.module';
import { MockDataSeed } from './common/seed/mock-data.seed';
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { User } from './modules/user/entities/user.entity';
import { Company } from './modules/company/entities/company.entity';
import { Job } from './modules/job/entities/job.entity';

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

    // 速率限制（每分钟最多60次请求）
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),

    // 业务模块
    RedisModule,     // Redis 缓存（全局模块）
    AuthModule,      // 认证模块（注册/登录/验证码）
    UserModule,      // 用户模块（个人资料/密码/头像）
    SystemModule,    // 系统设置模块
    CommunityModule, // 社区论坛模块（帖子/评论/点赞/收藏）
    NotificationModule, // 消息通知模块
    ApplicationModule,  // 投递追踪模块
    ResumeModule,       // 简历管理模块
    InterviewModule,    // 智能面试模块
    JobModule,          // 职位管理模块
    CompanyModule,      // 企业管理模块
    TypeOrmModule.forFeature([User, Company, Job]),
  ],
  providers: [MockDataSeed],
})
export class AppModule {}
