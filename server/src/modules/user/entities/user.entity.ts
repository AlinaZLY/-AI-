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

  @Column({ length: 10, nullable: true, comment: '性别' })
  gender: string;

  @Column({ length: 100, nullable: true, comment: '学校' })
  school: string;

  @Column({ length: 100, nullable: true, comment: '专业' })
  major: string;

  @Column({ type: 'int', nullable: true, comment: '毕业年份' })
  graduationYear: number;

  @Column({ length: 20, nullable: true, comment: '学历(专科/本科/硕士/博士)' })
  degree: string;

  @Column({ type: 'text', nullable: true, comment: '个人简介' })
  bio: string;

  @Column({ type: 'simple-array', nullable: true, comment: '技能标签' })
  skills: string[];

  @Column({ default: true, comment: '账户是否启用' })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true, comment: '最后在线时间' })
  lastOnlineAt: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
