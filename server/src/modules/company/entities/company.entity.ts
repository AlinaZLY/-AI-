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

export enum CompanyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '关联用户ID(企业账号)' })
  @Index()
  userId: number;

  @Column({ length: 100, comment: '企业名称' })
  name: string;

  @Column({ nullable: true, comment: '企业Logo' })
  logo: string;

  @Column({ length: 50, nullable: true, comment: '所属行业' })
  industry: string;

  @Column({ length: 50, nullable: true, comment: '企业规模' })
  scale: string;

  @Column({ length: 200, nullable: true, comment: '官网地址' })
  website: string;

  @Column({ type: 'text', nullable: true, comment: '企业简介' })
  description: string;

  @Column({ length: 200, nullable: true, comment: '企业地址' })
  address: string;

  @Column({ length: 50, nullable: true, comment: '所在城市' })
  city: string;

  @Column({ length: 100, nullable: true, comment: '联系邮箱' })
  contactEmail: string;

  @Column({ length: 20, nullable: true, comment: '联系电话' })
  contactPhone: string;

  @Column({ length: 20, nullable: true, comment: '企业类型(company/individual)' })
  type: string;

  @Column({ nullable: true, comment: '法人/负责人姓名' })
  legalPerson: string;

  @Column({ nullable: true, comment: '统一社会信用代码' })
  creditCode: string;

  @Column({ nullable: true, comment: '身份证正面照片URL' })
  idCardFront: string;

  @Column({ nullable: true, comment: '身份证反面照片URL' })
  idCardBack: string;

  @Column({ nullable: true, comment: '营业执照照片URL' })
  businessLicense: string;

  @Column({ type: 'text', nullable: true, comment: '审核拒绝原因' })
  rejectReason: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.PENDING,
    comment: '审核状态',
  })
  status: CompanyStatus;

  @Column({ default: false, comment: '是否认证' })
  isVerified: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
