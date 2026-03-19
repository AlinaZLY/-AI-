import { IsString, IsOptional, IsEnum, IsNumber, IsArray, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionDifficulty, QuestionType } from '../entities/question-bank.entity';

export class QuestionOptionDto {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsOptional()
  isCorrect?: boolean;
}

export class CreateQuestionDto {
  @IsString()
  @Length(1, 2000)
  question: string;

  @IsOptional()
  @IsString()
  referenceAnswer?: string;

  @IsOptional()
  @IsEnum(QuestionType)
  questionType?: QuestionType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  positionType?: string;

  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
