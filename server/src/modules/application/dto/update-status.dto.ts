import { IsString, IsOptional, IsEnum, Length, IsDateString } from 'class-validator';
import { ApplicationStatus } from '../entities/application.entity';

export class UpdateStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;

  @IsOptional()
  @IsDateString()
  nextDate?: string;
}
