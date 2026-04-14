import { IsOptional, IsString, IsEnum, IsNumber, Max } from 'class-validator';
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
  @Type(() => Number)
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
