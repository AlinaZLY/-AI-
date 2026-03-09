/**
 * 系统设置实体
 * 存储平台全局配置（网站名称等），使用 key-value 形式
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_settings')
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id: number;

  /** 配置键名 */
  @Column({ length: 100, unique: true, comment: '配置键名' })
  key: string;

  /** 配置值 */
  @Column({ type: 'text', comment: '配置值' })
  value: string;

  /** 配置描述 */
  @Column({ length: 200, nullable: true, comment: '配置说明' })
  description: string;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
