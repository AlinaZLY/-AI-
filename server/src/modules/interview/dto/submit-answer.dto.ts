import { IsString, IsOptional, IsNumber, Length } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  @Length(1, 10000)
  answer: string;

  @IsOptional()
  @IsString()
  answerType?: 'text' | 'voice';

  @IsOptional()
  @IsString()
  voiceUrl?: string;

  @IsOptional()
  @IsNumber()
  voiceDuration?: number;
}
