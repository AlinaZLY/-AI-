import { IsNotEmpty, IsString, IsOptional, IsInt, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString()
  @MaxLength(5000, { message: '评论内容最长5000字符' })
  content: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
