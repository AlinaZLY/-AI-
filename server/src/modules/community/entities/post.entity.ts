import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

/** 帖子分类枚举 */
export enum PostCategory {
  INTERVIEW = 'interview',       // 面经
  WRITTEN_TEST = 'written_test', // 笔经
  JOB_HUNTING = 'job_hunting',   // 求职感悟
  COMPANY = 'company',           // 公司评价
  OTHER = 'other',               // 其他
}

/** 帖子审核状态枚举 */
export enum PostStatus {
  PENDING = 'pending',     // 待审核
  APPROVED = 'approved',   // 已通过
  REJECTED = 'rejected',   // 已拒绝
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, comment: '标题' })
  title: string;

  @Column({ type: 'text', comment: '内容' })
  content: string;

  @Column({
    type: 'enum',
    enum: PostCategory,
    default: PostCategory.OTHER,
    comment: '分类',
  })
  category: PostCategory;

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

  @Column({ length: 200, nullable: true, comment: '拒绝原因' })
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

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
