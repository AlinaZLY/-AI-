/**
 * 用户实体
 * 对应数据库 users 表，支持三种角色：学生、企业、管理员
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/** 用户角色枚举 */
export enum UserRole {
  STUDENT = 'student',
  ENTERPRISE = 'enterprise',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, comment: '用户名' })
  username: string;

  @Column({ select: false, comment: '密码（加密存储）' })
  password: string;

  @Column({ unique: true, length: 100, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ length: 20, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ length: 50, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
    comment: '用户角色',
  })
  role: UserRole;

  @Column({ length: 100, nullable: true, comment: '求职意向' })
  jobIntention: string;

  @Column({ default: true, comment: '账户是否启用' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
