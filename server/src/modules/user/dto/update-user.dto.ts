/**
 * 更新用户资料 DTO
 * 所有字段均为可选，只更新传入的字段
 */
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  nickname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  jobIntention?: string;
}
