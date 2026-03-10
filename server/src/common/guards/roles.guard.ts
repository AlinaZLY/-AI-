/**
 * 角色守卫
 * 配合 @Roles() 装饰器使用，校验当前用户是否拥有接口所需角色
 * 需要在 JwtAuthGuard 之后使用，因为它依赖 req.user
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../modules/user/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取接口上标记的角色要求
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有标记角色要求，则允许访问
    if (!requiredRoles) {
      return true;
    }

    // 从请求中获取当前用户信息（由 JwtAuthGuard 注入）
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
