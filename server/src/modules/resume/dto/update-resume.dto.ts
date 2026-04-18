import { IsString, Length, IsOptional, IsNumber, IsObject } from 'class-validator';

export class UpdateResumeDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  targetPosition?: string;

  @IsOptional()
  @IsNumber()
  templateId?: number;

  @IsOptional()
  @IsObject()
  content?: Record<string, any>;
}
