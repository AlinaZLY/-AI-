import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CompanyStatus } from '../entities/company.entity';

export class UpdateCompanyStatusDto {
  @IsEnum(CompanyStatus)
  status: CompanyStatus;

  @IsOptional()
  @IsString()
  rejectReason?: string;
}
