import { IsNotEmpty, IsString, MaxLength, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MaxLength(200, { message: '标题最长200字符' })
  title: string;

  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分类ID必须为整数' })
  categoryId?: number;
}
