import { IsNotEmpty, IsString, MaxLength, IsOptional, IsIn, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SendAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsIn(['all', 'student', 'enterprise'])
  target?: 'all' | 'student' | 'enterprise';

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  userIds?: number[];
}
