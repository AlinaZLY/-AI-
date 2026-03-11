/**
 * 用户登录 DTO
 * 校验登录时提交的用户名、密码和验证码
 */
import { IsString, Length } from 'class-validator';

export class LoginDto {
  /** 用户名 */
  @IsString()
  @Length(3, 50)
  username: string;

  /** 密码 */
  @IsString()
  @Length(6, 100)
  password: string;

  /** 验证码 */
  @IsString()
  captcha: string;

  /** 验证码唯一标识 */
  @IsString()
  captchaKey: string;
}
