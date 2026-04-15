import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: '企业名称不能为空' })
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  legalPerson?: string;

  @IsOptional()
  @IsString()
  creditCode?: string;

  @IsOptional()
  @IsString()
  idCardFront?: string;

  @IsOptional()
  @IsString()
  idCardBack?: string;

  @IsOptional()
  @IsString()
  businessLicense?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  industry?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  scale?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  city?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
