/**
 * 用户注册 DTO
 * 校验注册时提交的参数
 */
import { Type } from 'class-transformer';
import { IsString, Length, IsOptional, IsEmail, IsEnum, IsIn, ValidateNested } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class RegisterEnterpriseDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  legalPerson?: string;

  @IsOptional()
  @IsString()
  creditCode?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;

  @IsOptional()
  @IsString()
  idCardFront?: string;

  @IsOptional()
  @IsString()
  idCardBack?: string;
}

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
  @IsIn([UserRole.STUDENT, UserRole.ENTERPRISE], { message: '角色只能是 student 或 enterprise' })
  role?: UserRole;

  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterEnterpriseDto)
  enterpriseInfo?: RegisterEnterpriseDto;
}
