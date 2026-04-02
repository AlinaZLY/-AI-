import { IsOptional, IsString, Length } from 'class-validator';

export class ApplicationActionDto {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  note?: string;
}
