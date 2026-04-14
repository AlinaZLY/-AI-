/**
 * 修改密码 DTO
 * 需要旧密码验证 + 新密码确认
 */
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  /** 旧密码 */
  @IsString()
  @Length(6, 100)
  oldPassword: string;

  /** 新密码 */
  @IsString()
  @Length(6, 100)
  newPassword: string;
}
