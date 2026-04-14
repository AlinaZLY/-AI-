/**
 * 角色装饰器
 * 用于标记接口需要的角色权限
 * 使用方式：@Roles(UserRole.ADMIN, UserRole.ENTERPRISE)
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/user/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
