import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { QuestionBank } from './question-bank.entity';

@Entity('practice_records')
export class PracticeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '题目ID' })
  questionId: number;

  @Column({ type: 'text', comment: '用户回答' })
  answer: string;

  @Column({ type: 'int', default: 0, comment: '得分 0-100' })
  score: number;

  @Column({ type: 'json', nullable: true, comment: '维度分数' })
  dimensionScores: Record<string, number>;

  @Column({ type: 'text', nullable: true, comment: 'AI 反馈' })
  feedback: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => QuestionBank, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: QuestionBank;
}
