import { IsOptional, IsString, IsEnum, IsNumberString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { JobStatus, WorkType } from '../entities/job.entity';

export class QueryJobDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Max(100)
  pageSize?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  positionType?: string;

  @IsOptional()
  @IsEnum(WorkType)
  workType?: WorkType;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsNumberString()
  companyId?: number;

  @IsOptional()
  @IsNumberString()
  salaryMin?: number;

  @IsOptional()
  @IsNumberString()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
