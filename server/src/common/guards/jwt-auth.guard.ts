/**
 * JWT 认证守卫
 * 用于保护需要登录才能访问的接口
 * 使用方式：在 Controller 或方法上添加 @UseGuards(JwtAuthGuard)
 */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
