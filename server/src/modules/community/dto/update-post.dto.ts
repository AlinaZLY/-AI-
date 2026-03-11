import { IsOptional, IsString, MaxLength, IsEnum } from 'class-validator';
import { PostCategory } from '../entities/post.entity';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: '标题最长200字符' })
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(PostCategory, { message: '分类不合法' })
  category?: PostCategory;
}
