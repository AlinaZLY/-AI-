import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 可选 JWT 认证：有有效 token 时注入 req.user；没有 token 时按匿名用户继续处理。
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    _err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    return (user || null) as TUser;
  }
}
