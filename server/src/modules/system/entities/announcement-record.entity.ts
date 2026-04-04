import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcement_records')
export class AnnouncementRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200, comment: '公告标题' })
  title: string;

  @Column({ type: 'text', comment: '公告正文' })
  content: string;

  @Column({ length: 20, default: 'all', comment: '发送范围' })
  target: string;

  @Column({ type: 'json', nullable: true, comment: '指定用户列表' })
  userIds: number[];

  @Column({ type: 'int', default: 0, comment: '通知人数' })
  notifiedCount: number;

  @Column({ nullable: true, comment: '管理员用户ID' })
  adminUserId: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;
}
