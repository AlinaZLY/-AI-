import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';

export enum NoteType {
  INTERVIEW = 'interview',
  COMPANY = 'company',
  SALARY = 'salary',
  OTHER = 'other',
}

@Entity('application_notes')
export class ApplicationNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '投递记录ID' })
  applicationId: number;

  @Column({ type: 'enum', enum: NoteType, default: NoteType.OTHER, comment: '备注类型' })
  type: NoteType;

  @Column({ type: 'text', comment: '备注内容' })
  content: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @ManyToOne(() => Application, (app) => app.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicationId' })
  application: Application;
}
