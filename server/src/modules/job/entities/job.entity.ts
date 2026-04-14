import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  PAUSED = 'paused',
}

export enum WorkType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERN = 'intern',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '发布者用户ID' })
  @Index()
  userId: number;

  @Column({ nullable: true, comment: '关联企业ID' })
  @Index()
  companyId: number;

  @Column({ length: 100, comment: '岗位名称' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '岗位描述' })
  description: string;

  @Column({ type: 'text', nullable: true, comment: '任职要求' })
  requirements: string;

  @Column({ length: 50, nullable: true, comment: '岗位类型(前端/后端/设计等)' })
  positionType: string;

  @Column({ type: 'int', nullable: true, comment: '最低薪资(元/月)' })
  salaryMin: number;

  @Column({ type: 'int', nullable: true, comment: '最高薪资(元/月)' })
  salaryMax: number;

  @Column({ length: 100, nullable: true, comment: '工作地点' })
  location: string;

  @Column({
    type: 'enum',
    enum: WorkType,
    default: WorkType.FULL_TIME,
    comment: '工作类型',
  })
  workType: WorkType;

  @Column({ type: 'int', default: 1, comment: '招聘人数' })
  headcount: number;

  @Column({ type: 'date', nullable: true, comment: '截止日期' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
    comment: '职位状态',
  })
  @Index()
  status: JobStatus;

  @Column({ type: 'int', default: 0, comment: '浏览次数' })
  viewCount: number;

  @Column({ type: 'int', default: 0, comment: '投递人数' })
  applicationCount: number;

  @Column({ type: 'simple-array', nullable: true, comment: '标签' })
  tags: string[];

  @Column({ length: 100, nullable: true, comment: '公司名称(冗余快查)' })
  companyName: string;

  @Column({ length: 50, nullable: true, comment: '学历要求' })
  education: string;

  @Column({ length: 200, nullable: true, comment: '福利待遇' })
  benefits: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
