import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', comment: '评论内容' })
  content: string;

  @Column({ comment: '帖子ID' })
  postId: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ comment: '评论者ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true, comment: '父评论ID（用于嵌套回复）' })
  parentId: number;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @Column({ default: 0, comment: '点赞数' })
  likeCount: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
