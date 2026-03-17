/**
 * 用户登录 DTO
 * 校验登录时提交的用户名、密码和验证码
 */
import { IsString, Length, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  captcha: string;

  @IsString()
  captchaKey: string;

  /** 登录来源：admin-管理后台，client-客户端 */
  @IsOptional()
  @IsString()
  platform?: string;
}
