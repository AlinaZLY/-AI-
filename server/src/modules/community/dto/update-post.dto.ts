import { IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '标题最长200字符' })
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分类ID必须为整数' })
  categoryId?: number;
}
