import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getOrCreateConversation(userAId: number, userBId: number, jobId?: number): Promise<{ conversation: Conversation; isNew: boolean }> {
    const minId = Math.min(userAId, userBId);
    const maxId = Math.max(userAId, userBId);

    // 同一对用户可以围绕不同职位存在多条会话；否则会把多岗位沟通串到一起。
    let conv = await this.findConversationByScope(minId, maxId, jobId);

    if (conv) return { conversation: conv, isNew: false };

    const conversationData: Partial<Conversation> = { userAId: minId, userBId: maxId };
    if (jobId != null) {
      conversationData.jobId = jobId;
    }
    conv = this.conversationRepo.create(conversationData);
    conv = await this.conversationRepo.save(conv);
    conv = (await this.conversationRepo.findOne({ where: { id: conv.id } }))!;
    return { conversation: conv, isNew: true };
  }

  async getConversations(userId: number) {
    const convs = await this.conversationRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.userA', 'userA')
      .leftJoinAndSelect('c.userB', 'userB')
      .leftJoinAndSelect('c.job', 'job')
      .where('c.userAId = :userId OR c.userBId = :userId', { userId })
      .orderBy('CASE WHEN c.lastMessageAt IS NULL THEN 1 ELSE 0 END', 'ASC')
      .addOrderBy('c.lastMessageAt', 'DESC')
      .addOrderBy('c.createdAt', 'DESC')
      .getMany();

    if (convs.length === 0) return [];

    const convIds = convs.map((c) => c.id);
    const unreadRows = await this.messageRepo
      .createQueryBuilder('m')
      .select('m.conversationId', 'conversationId')
      .addSelect('COUNT(*)', 'count')
      .where('m.conversationId IN (:...convIds)', { convIds })
      .andWhere('m.isRead = false')
      .andWhere('m.senderId != :uid', { uid: userId })
      .groupBy('m.conversationId')
      .getRawMany();
    const unreadMap = new Map<number, number>(
      unreadRows.map((r: any) => [Number(r.conversationId), Number(r.count)]),
    );

    return convs.map((conv) =>
      Object.assign(conv, { unreadCount: unreadMap.get(conv.id) || 0 }),
    );
  }

  async isConversationMember(conversationId: number, userId: number): Promise<boolean> {
    const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
    return !!conv && (conv.userAId === userId || conv.userBId === userId);
  }

  async getMessages(conversationId: number, userId: number, page = 1, pageSize = 50) {
    const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conv || (conv.userAId !== userId && conv.userBId !== userId)) {
      return { list: [], total: 0 };
    }

    const [list, total] = await this.messageRepo.findAndCount({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('conversationId = :cid AND senderId != :uid AND isRead = false', { cid: conversationId, uid: userId })
      .execute();

    return { list, total };
  }

  async sendMessage(conversationId: number, senderId: number, content: string) {
    const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conv || (conv.userAId !== senderId && conv.userBId !== senderId)) {
      throw new Error('无权发送消息');
    }

    const msg = this.messageRepo.create({ conversationId, senderId, content });
    const saved = await this.messageRepo.save(msg);

    conv.lastMessage = content.length > 100 ? content.substring(0, 100) + '...' : content;
    conv.lastMessageAt = new Date();
    await this.conversationRepo.save(conv);

    const full = await this.messageRepo.findOne({ where: { id: saved.id } });
    return full;
  }

  async getUserLastOnline(userId: number) {
    return this.userRepo.findOne({ where: { id: userId }, select: ['id', 'lastOnlineAt'] });
  }

  async getUnreadTotal(userId: number): Promise<number> {
    return this.messageRepo
      .createQueryBuilder('m')
      .innerJoin('m.conversation', 'c')
      .where('(c.userAId = :uid OR c.userBId = :uid)', { uid: userId })
      .andWhere('m.senderId != :uid', { uid: userId })
      .andWhere('m.isRead = false')
      .getCount();
  }

  private findConversationByScope(userAId: number, userBId: number, jobId?: number) {
    const qb = this.conversationRepo
      .createQueryBuilder('c')
      .where('c.userAId = :userAId AND c.userBId = :userBId', { userAId, userBId });

    if (jobId == null) {
      qb.andWhere('c.jobId IS NULL');
    } else {
      qb.andWhere('c.jobId = :jobId', { jobId });
    }

    return qb.getOne();
  }
}
