import { IsString, IsOptional, Length } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  @Length(1, 10000)
  answer: string;

  @IsOptional()
  @IsString()
  answerType?: 'text' | 'voice';
}
