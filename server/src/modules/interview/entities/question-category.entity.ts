import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';

@Entity('question_categories')
export class QuestionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, comment: '分类名称' })
  name: string;

  @Column({ nullable: true, comment: '父分类ID' })
  parentId: number;

  @Column({ length: 30, nullable: true, comment: '分类类型(company/position/type)' })
  type: string;

  @Column({ length: 200, nullable: true, comment: '描述' })
  description: string;

  @Column({ default: 0, comment: '排序' })
  sort: number;

  @Column({ default: 0, comment: '题目数量' })
  questionCount: number;

  @Column({ nullable: true, comment: '封面图URL' })
  coverImage: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => QuestionCategory, (cat) => cat.children, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  parent: QuestionCategory;

  @OneToMany(() => QuestionCategory, (cat) => cat.parent)
  children: QuestionCategory[];
}
