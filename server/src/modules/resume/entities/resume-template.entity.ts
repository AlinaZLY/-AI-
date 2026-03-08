import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resume_templates')
export class ResumeTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, comment: '模板名称' })
  name: string;

  @Column({ nullable: true, comment: '模板缩略图URL' })
  thumbnail: string;

  @Column({ type: 'json', nullable: true, comment: '模板布局配置' })
  layout: Record<string, any>;

  @Column({ type: 'longtext', nullable: true, comment: 'HTML模板内容' })
  htmlContent: string;

  @Column({ type: 'text', nullable: true, comment: 'CSS样式' })
  cssContent: string;

  @Column({ length: 200, nullable: true, comment: '模板描述' })
  description: string;

  @Column({ length: 30, default: '通用', comment: '模板分类' })
  category: string;

  @Column({ default: true, comment: '是否为系统内置模板' })
  isSystem: boolean;

  @Column({ default: 0, comment: '排序权重' })
  sort: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
