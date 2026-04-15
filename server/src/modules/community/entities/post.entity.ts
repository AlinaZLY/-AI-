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
import { Category } from './category.entity';

/** 帖子审核状态枚举 */
export enum PostStatus {
  PENDING = 'pending',     // 待审核
  APPROVED = 'approved',   // 已通过
  REJECTED = 'rejected',   // 已拒绝
}

/** 帖子来源枚举 */
export enum PostSource {
  PLATFORM = 'platform',   // 平台帖子（管理员发布）
  USER = 'user',           // 用户帖子（含企业用户）
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '内容' })
  content: string;

  @Column({ type: 'json', nullable: true, comment: '帖子图片 URL 列表' })
  images: string[] | null;

  @Column({ nullable: true, comment: '分类ID' })
  categoryId: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ comment: '作者ID' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PENDING,
    comment: '审核状态',
  })
  status: PostStatus;

  @Column({ type: 'varchar', length: 200, nullable: true, default: null, comment: '拒绝原因' })
  rejectReason: string;

  @Column({ default: 0, comment: '浏览量' })
  viewCount: number;

  @Column({ default: 0, comment: '点赞数' })
  likeCount: number;

  @Column({ default: 0, comment: '评论数' })
  commentCount: number;

  @Column({ default: 0, comment: '收藏数' })
  favoriteCount: number;

  @Column({ default: false, comment: '是否置顶' })
  isTop: boolean;

  @Column({ default: true, comment: '是否启用' })
  enabled: boolean;

  @Column({
    type: 'enum',
    enum: PostSource,
    default: PostSource.USER,
    comment: '帖子来源：platform-平台帖子, user-用户帖子',
  })
  source: PostSource;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
