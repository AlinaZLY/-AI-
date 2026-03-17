/**
 * 用户注册 DTO
 * 校验注册时提交的参数
 */
import { IsString, Length, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '角色只能是 student 或 enterprise' })
  role?: UserRole;
}
