import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
  COMMENT = 'comment',
  LIKE = 'like',
  COMMENT_LIKE = 'comment_like',
  FAVORITE = 'favorite',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: NotificationType, comment: '通知类型' })
  type: NotificationType;

  @Column({ comment: '接收者用户ID' })
  userId: number;

  @Column({ nullable: true, comment: '发送者用户ID' })
  fromUserId: number;

  @Column({ nullable: true, comment: '关联帖子ID' })
  postId: number;

  @Column({ nullable: true, comment: '关联评论ID' })
  commentId: number;

  @Column({ length: 500, comment: '通知内容' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '业务跳转元数据' })
  meta: Record<string, any>;

  @Column({ default: false, comment: '是否已读' })
  isRead: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;
}
