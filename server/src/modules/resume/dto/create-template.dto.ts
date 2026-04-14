import { IsString, Length, IsOptional, IsNumber, IsBoolean, IsObject } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @IsOptional()
  @IsString()
  htmlContent?: string;

  @IsOptional()
  @IsString()
  cssContent?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  category?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsObject()
  layout?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}
