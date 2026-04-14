import { IsOptional, IsString, MaxLength, IsInt, IsBoolean, IsEnum, IsArray, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { PostSource } from '../entities/post.entity';

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

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsEnum(PostSource)
  source?: PostSource;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: '图片最多20张' })
  @IsString({ each: true })
  @MaxLength(2048, { each: true, message: '单张图片地址过长' })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isTop?: boolean;
}
