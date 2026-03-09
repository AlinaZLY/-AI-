/**
 * AI 调用日志实体
 * 记录大模型 API 调用情况
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ai_call_logs')
export class AiCallLog {
  @PrimaryGeneratedColumn()
  id: number;

  /** 调用场景：resume_analysis, interview_score, optimize 等 */
  @Column({ length: 64, comment: '调用场景' })
  scene: string;

  /** 使用的模型 ID 或名称 */
  @Column({ length: 128, nullable: true, comment: '模型' })
  model: string;

  /** 消耗 Token 数 */
  @Column({ type: 'int', default: 0, comment: 'Token 数' })
  tokens: number;

  /** 耗时（毫秒） */
  @Column({ type: 'int', nullable: true, comment: '耗时 ms' })
  duration: number;

  /** 状态：success / failed */
  @Column({ length: 20, default: 'success', comment: '状态' })
  status: string;

  /** 错误信息（失败时） */
  @Column({ type: 'text', nullable: true, comment: '错误信息' })
  errorMessage: string;

  @CreateDateColumn({ comment: '调用时间' })
  createdAt: Date;
}
