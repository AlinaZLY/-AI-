/**
 * 认证模块
 * 集成 Passport + JWT，提供用户注册/登录功能
 * 导出 JwtModule 供其他模块使用 JWT 功能
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { NotificationModule } from '../notification/notification.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Company]),
    PassportModule,
    NotificationModule,
    SystemModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
