import { IsString, Length } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  @Length(1, 10000)
  answer: string;
}
