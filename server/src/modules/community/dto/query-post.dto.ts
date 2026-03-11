import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PostStatus, PostSource } from '../entities/post.entity';

export class QueryPostDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  sort?: 'latest' | 'hot';

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsEnum(PostSource)
  source?: PostSource;
}
