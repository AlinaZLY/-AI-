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

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ length: 100, comment: '简历标题' })
  title: string;

  @Column({ length: 50, nullable: true, comment: '目标岗位' })
  targetPosition: string;

  @Column({ default: 1, comment: '版本号' })
  version: number;

  @Column({ nullable: true, comment: '模板ID' })
  templateId: number;

  @Column({ type: 'json', nullable: true, comment: '简历内容(JSON结构化数据)' })
  content: Record<string, any>;

  @Column({ nullable: true, comment: '上传的简历文件路径' })
  filePath: string;

  @Column({ default: false, comment: '是否为默认简历' })
  isDefault: boolean;

  @Column({ nullable: true, comment: 'AI 分析结果(JSON)' })
  analysisResult: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
