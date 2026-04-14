import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getNotifications(@Request() req, @Query() query: QueryNotificationDto) {
    return this.notificationService.getUserNotifications(
      req.user.id,
      +(query.page || 1),
      Math.min(+(query.pageSize || 20), 100),
      query.type,
      query.isRead,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('read')
  deleteAllRead(@Request() req) {
    return this.notificationService.deleteAllRead(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteNotification(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.notificationService.deleteNotification(id, req.user.id);
  }
}
