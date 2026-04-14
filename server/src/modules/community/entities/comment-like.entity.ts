import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from './comment.entity';

@Entity('comment_likes')
@Unique(['userId', 'commentId'])
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ comment: '评论ID' })
  commentId: number;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @CreateDateColumn({ comment: '点赞时间' })
  createdAt: Date;
}
