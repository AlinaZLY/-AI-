import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(data: {
    type: NotificationType;
    userId: number;
    fromUserId?: number;
    postId?: number;
    commentId?: number;
    content: string;
    meta?: Record<string, any>;
  }) {
    if (data.userId === data.fromUserId) return null;
    const notification = this.notificationRepo.create(data);
    return this.notificationRepo.save(notification);
  }

  async getUserNotifications(
    userId: number,
    page = 1,
    pageSize = 20,
    type?: NotificationType,
    isRead?: boolean,
  ) {
    const qb = this.notificationRepo
      .createQueryBuilder('n')
      .leftJoin('n.fromUser', 'fromUser')
      .addSelect(['fromUser.id', 'fromUser.username', 'fromUser.nickname', 'fromUser.avatar'])
      .where('n.userId = :userId', { userId });

    if (type) {
      qb.andWhere('n.type = :type', { type });
    }
    if (isRead !== undefined) {
      qb.andWhere('n.isRead = :isRead', { isRead });
    }

    qb.orderBy('n.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepo.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    await this.notificationRepo.update(
      { id: notificationId, userId },
      { isRead: true },
    );
  }

  async markAllAsRead(userId: number) {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async deleteNotification(notificationId: number, userId: number) {
    await this.notificationRepo.delete({ id: notificationId, userId });
  }

  async deleteAllRead(userId: number) {
    await this.notificationRepo.delete({ userId, isRead: true });
  }
}
