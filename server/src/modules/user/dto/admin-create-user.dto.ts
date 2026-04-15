import { IsString, IsOptional, IsEnum, Length, IsEmail, Matches } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class AdminCreateUserDto {
  @IsString()
  @Length(2, 50)
  username: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  @IsOptional()
  @Matches(/^1\d{10}$/, { message: '手机号格式不正确' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: '角色必须为 student、enterprise 或 admin' })
  role?: UserRole;
}
