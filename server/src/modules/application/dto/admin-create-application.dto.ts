import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { CreateApplicationDto } from './create-application.dto';

export class AdminCreateApplicationDto extends CreateApplicationDto {
  @Type(() => Number)
  @IsNumber()
  userId: number;
}
