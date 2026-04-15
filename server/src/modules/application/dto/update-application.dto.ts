import { IsString, Length, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApplicationTag } from '../entities/application.entity';

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  company?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  position?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  channel?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  salaryRange?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  location?: string;

  @IsOptional()
  @IsDateString()
  nextDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  remark?: string;

  @IsOptional()
  @IsEnum(ApplicationTag)
  tag?: ApplicationTag;
}
