import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true, comment: '分类名称' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null, comment: '图标URL' })
  icon: string;

  @Column({ type: 'varchar', length: 20, default: 'blue', comment: '标签颜色' })
  color: string;

  @Column({ type: 'varchar', length: 200, nullable: true, default: null, comment: '分类描述' })
  description: string;

  @Column({ type: 'int', default: 0, comment: '排序值(越小越靠前)' })
  sort: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
