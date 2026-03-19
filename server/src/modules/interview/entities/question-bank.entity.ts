import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestionSource {
  SYSTEM = 'system',
  USER = 'user',
}

export enum QuestionType {
  OPEN = 'open',
  CHOICE = 'choice',
  JUDGMENT = 'judgment',
  SHORT_ANSWER = 'short_answer',
}

@Entity('question_bank')
export class QuestionBank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', comment: '题目内容' })
  question: string;

  @Column({ type: 'text', nullable: true, comment: '参考答案' })
  referenceAnswer: string;

  @Column({ type: 'varchar', length: 20, default: QuestionType.OPEN, comment: '题型(open/choice/judgment/short_answer)' })
  questionType: QuestionType;

  @Column({ type: 'json', nullable: true, comment: '选项(选择题/判断题)' })
  options: { label: string; value: string; isCorrect?: boolean }[];

  @Column({ nullable: true, comment: '分类ID' })
  categoryId: number;

  @Column({ length: 50, nullable: true, comment: '公司名称' })
  company: string;

  @Column({ length: 50, nullable: true, comment: '岗位类型' })
  positionType: string;

  @Column({ type: 'varchar', length: 20, default: QuestionDifficulty.MEDIUM, comment: '难度' })
  difficulty: QuestionDifficulty;

  @Column({ type: 'varchar', length: 20, default: QuestionSource.SYSTEM, comment: '来源' })
  source: QuestionSource;

  @Column({ default: 0, comment: '被使用次数' })
  frequency: number;

  @Column({ type: 'simple-array', nullable: true, comment: '标签' })
  tags: string[];

  @Column({ nullable: true, comment: '创建者用户ID' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
