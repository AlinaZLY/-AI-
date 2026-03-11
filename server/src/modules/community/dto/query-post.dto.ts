import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PostCategory, PostStatus } from '../entities/post.entity';

export class QueryPostDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  sort?: 'latest' | 'hot';

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
