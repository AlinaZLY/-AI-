import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { InterviewQuestion } from './interview-question.entity';

export enum InterviewStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ length: 100, nullable: true, comment: '岗位JD标题' })
  jobTitle: string;

  @Column({ type: 'text', nullable: true, comment: '岗位JD内容' })
  jobDescription: string;

  @Column({ nullable: true, comment: '关联简历ID' })
  resumeId: number;

  @Column({ type: 'varchar', length: 20, default: InterviewStatus.IN_PROGRESS, comment: '面试状态' })
  status: InterviewStatus;

  @Column({ default: 0, comment: '总得分' })
  totalScore: number;

  @Column({ type: 'json', nullable: true, comment: '各维度评分(JSON)' })
  dimensionScores: Record<string, number>;

  @Column({ type: 'text', nullable: true, comment: 'AI 总体评价' })
  overallFeedback: string;

  @Column({ default: 0, comment: '题目总数' })
  questionCount: number;

  @Column({ default: 0, comment: '已回答数' })
  answeredCount: number;

  @Column({ type: 'json', nullable: true, comment: '出题策略元数据' })
  questionStrategy: Record<string, any>;

  @CreateDateColumn({ comment: '开始时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => InterviewQuestion, (q) => q.interview)
  questions: InterviewQuestion[];
}
