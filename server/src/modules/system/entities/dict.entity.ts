import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  OneToMany, ManyToOne, JoinColumn,
} from 'typeorm';

@Entity('dict_types')
export class DictType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true, comment: '字典类型编码' })
  code: string;

  @Column({ length: 50, comment: '字典类型名称' })
  name: string;

  @Column({ length: 200, nullable: true, comment: '描述' })
  description: string;

  @Column({ default: true, comment: '是否启用' })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => DictItem, (item) => item.dictType)
  items: DictItem[];
}

@Entity('dict_items')
export class DictItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属字典类型ID' })
  dictTypeId: number;

  @Column({ length: 50, comment: '字典项值' })
  value: string;

  @Column({ length: 50, comment: '字典项标签' })
  label: string;

  @Column({ length: 20, nullable: true, comment: '颜色标识' })
  color: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;

  @Column({ default: true, comment: '是否启用' })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => DictType, (type) => type.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dictTypeId' })
  dictType: DictType;
}
