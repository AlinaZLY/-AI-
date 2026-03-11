import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: '评论内容不能为空' })
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
