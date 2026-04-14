import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateJobDto } from './create-job.dto';
import { JobStatus } from '../entities/job.entity';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
