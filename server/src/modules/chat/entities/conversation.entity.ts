import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Job } from '../../job/entities/job.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户A（通常是应聘者）' })
  userAId: number;

  @Column({ comment: '用户B（通常是企业方）' })
  userBId: number;

  @Column({ nullable: true, comment: '关联职位ID' })
  jobId: number;

  @Column({ type: 'text', nullable: true, comment: '最后一条消息预览' })
  lastMessage: string;

  @Column({ type: 'datetime', nullable: true, comment: '最后消息时间' })
  lastMessageAt: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userAId' })
  userA: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userBId' })
  userB: User;

  @ManyToOne(() => Job, { eager: true, nullable: true })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
