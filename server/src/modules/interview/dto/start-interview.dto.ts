import { IsString, IsOptional, IsNumber, Length } from 'class-validator';

export class StartInterviewDto {
  @IsOptional()
  @IsString()
  @Length(0, 100)
  jobTitle?: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsNumber()
  resumeId?: number;

  @IsOptional()
  @IsNumber()
  questionCount?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
