import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PostStatus } from '../entities/post.entity';

export class ReviewPostDto {
  @IsEnum(PostStatus)
  status: PostStatus;

  @IsOptional()
  @IsString()
  rejectReason?: string;
}
