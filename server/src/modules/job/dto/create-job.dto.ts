import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsDateString, Length, Min } from 'class-validator';
import { WorkType } from '../entities/job.entity';

export class CreateJobDto {
  @IsString({ message: '岗位名称不能为空' })
  @Length(1, 100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  positionType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  location?: string;

  @IsOptional()
  @IsEnum(WorkType, { message: '工作类型无效' })
  workType?: WorkType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  headcount?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  companyId?: number;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  benefits?: string;
}
