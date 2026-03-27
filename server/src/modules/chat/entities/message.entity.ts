import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '所属会话' })
  conversationId: number;

  @Column({ comment: '发送者' })
  senderId: number;

  @Column({ type: 'text', comment: '消息内容' })
  content: string;

  @Column({ default: false, comment: '是否已读' })
  isRead: boolean;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}
