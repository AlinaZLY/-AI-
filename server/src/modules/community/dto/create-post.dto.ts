import { IsNotEmpty, IsString, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { PostCategory } from '../entities/post.entity';

export class CreatePostDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @MaxLength(200, { message: '标题最长200字符' })
  title: string;

  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(PostCategory, { message: '分类不合法' })
  category?: PostCategory;
}
