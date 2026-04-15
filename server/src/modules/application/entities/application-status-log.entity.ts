import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';

@Entity('application_status_logs')
export class ApplicationStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '投递记录ID' })
  applicationId: number;

  @Column({ length: 30, comment: '变更前状态' })
  fromStatus: string;

  @Column({ length: 30, comment: '变更后状态' })
  toStatus: string;

  @Column({ length: 500, nullable: true, comment: '变更备注' })
  note: string;

  @CreateDateColumn({ comment: '变更时间' })
  createdAt: Date;

  @ManyToOne(() => Application, (app) => app.statusLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}
