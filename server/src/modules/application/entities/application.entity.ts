import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApplicationStatusLog } from './application-status-log.entity';
import { ApplicationNote } from './application-note.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  WRITTEN_TEST = 'written_test',
  FIRST_INTERVIEW = 'first_interview',
  SECOND_INTERVIEW = 'second_interview',
  HR_INTERVIEW = 'hr_interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
}

export enum ApplicationTag {
  IN_PROGRESS = 'in_progress',
  PASSED = 'passed',
  FAILED = 'failed',
  ABANDONED = 'abandoned',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ length: 100, comment: '公司名称' })
  company: string;

  @Column({ length: 100, comment: '岗位名称' })
  position: string;

  @Column({ length: 50, nullable: true, comment: '投递渠道（官网/Boss/牛客等）' })
  channel: string;

  @Column({ length: 50, nullable: true, comment: '薪资范围' })
  salaryRange: string;

  @Column({ length: 200, nullable: true, comment: '工作地点' })
  location: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
    comment: '当前流程状态',
  })
  status: ApplicationStatus;

  @Column({
    type: 'enum',
    enum: ApplicationTag,
    default: ApplicationTag.IN_PROGRESS,
    comment: '状态标签',
  })
  tag: ApplicationTag;

  @Column({ type: 'date', nullable: true, comment: '下次面试/笔试日期' })
  nextDate: Date;

  @Column({ nullable: true, comment: '关联职位ID' })
  @Index()
  jobId: number;

  @Column({ nullable: true, comment: '关联简历ID' })
  resumeId: number;

  @Column({ type: 'text', nullable: true, comment: '职位描述(冗余)' })
  jobDescription: string;

  @Column({ length: 500, nullable: true, comment: '备注' })
  remark: string;

  @CreateDateColumn({ comment: '投递时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ApplicationStatusLog, (log) => log.application)
  statusLogs: ApplicationStatusLog[];

  @OneToMany(() => ApplicationNote, (note) => note.application)
  notes: ApplicationNote[];
}
