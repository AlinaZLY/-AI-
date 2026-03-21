import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class QueryNotificationDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  pageSize?: number;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @IsOptional()
  isRead?: string;
}
