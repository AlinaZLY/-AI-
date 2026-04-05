import { IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NotificationType } from '../entities/notification.entity';

export class QueryNotificationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isRead?: boolean;
}
