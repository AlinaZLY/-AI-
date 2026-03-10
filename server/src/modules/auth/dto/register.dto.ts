/**
 * 用户注册 DTO
 * 校验注册时提交的参数
 */
import { IsString, Length, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  /** 用户名，3-50 个字符 */
  @IsString()
  @Length(3, 50)
  username: string;

  /** 密码，6-100 个字符 */
  @IsString()
  @Length(6, 100)
  password: string;

  /** 邮箱（可选） */
  @IsOptional()
  @IsEmail()
  email?: string;

  /** 手机号（可选） */
  @IsOptional()
  @IsString()
  phone?: string;

  /** 昵称（可选） */
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  /** 角色（可选，默认为学生） */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
