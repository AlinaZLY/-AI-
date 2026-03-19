import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Interview } from './interview.entity';

@Entity('interview_questions')
export class InterviewQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '面试记录ID' })
  interviewId: number;

  @Column({ default: 0, comment: '题目序号' })
  orderIndex: number;

  @Column({ type: 'text', comment: '题目内容' })
  question: string;

  @Column({ length: 50, nullable: true, comment: '题目类型(behavioral/technical/situational)' })
  questionType: string;

  @Column({ type: 'text', nullable: true, comment: '用户回答' })
  answer: string;

  @Column({ default: 0, comment: '得分(0-100)' })
  score: number;

  @Column({ type: 'json', nullable: true, comment: '各维度评分' })
  dimensionScores: Record<string, number>;

  @Column({ type: 'text', nullable: true, comment: 'AI评价与建议' })
  feedback: string;

  @Column({ type: 'text', nullable: true, comment: '参考答案' })
  referenceAnswer: string;

  @Column({ default: false, comment: '是否已回答' })
  isAnswered: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Interview, (i) => i.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'interviewId' })
  interview: Interview;
}
