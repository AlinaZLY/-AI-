import {
  WebSocketGateway, WebSocketServer,
  SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from './chat.service';
import { User } from '../user/entities/user.entity';

const websocketCorsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:3100', 'http://localhost:5173', 'http://127.0.0.1:3100', 'http://127.0.0.1:5173'];

@WebSocketGateway({
  cors: { origin: websocketCorsOrigins, credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<number, Set<string>>();

  private emitPresenceChanged(userId: number, online: boolean) {
    this.server.emit('presenceChanged', {
      userId,
      online,
      lastOnlineAt: new Date().toISOString(),
    });
  }

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token || client.handshake.query?.token) as string;
      if (!token) { client.disconnect(); return; }
      const payload = this.jwtService.verify(token);
      const userId = payload.sub || payload.id;
      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: ['id', 'isActive'],
      });
      if (!user || !user.isActive) { client.disconnect(); return; }
      (client as any).userId = userId;
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);
      client.join(`user_${userId}`);
      this.userRepo.update(userId, { lastOnlineAt: new Date() }).catch(() => {});
      this.emitPresenceChanged(userId, true);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
        this.userRepo.update(userId, { lastOnlineAt: new Date() }).catch(() => {});
        this.emitPresenceChanged(userId, false);
      }
    }
  }

  isUserOnline(userId: number): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: { conversationId: number; content: string }) {
    const senderId = (client as any).userId;
    if (!senderId) return;

    if (!payload.content || typeof payload.content !== 'string' || payload.content.length > 5000) {
      client.emit('error', { message: '消息内容不能为空且不能超过5000字符' });
      return;
    }

    try {
      const msg = await this.chatService.sendMessage(payload.conversationId, senderId, payload.content);
      this.server.to(`conv_${payload.conversationId}`).emit('newMessage', msg);

      const convs = await this.chatService.getConversations(senderId);
      const conv = convs.find((c: any) => c.id === payload.conversationId);
      if (conv) {
        const otherUserId = (conv as any).userAId === senderId ? (conv as any).userBId : (conv as any).userAId;
        this.server.to(`user_${otherUserId}`).emit('newMessage', msg);
        this.server.to(`user_${otherUserId}`).emit('conversationUpdated', conv);
      }
    } catch (e) {
      client.emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(client: Socket, payload: { conversationId: number }) {
    const userId = (client as any).userId;
    if (!userId) {
      client.emit('error', { message: '未登录，无法加入会话' });
      return;
    }

    const allowed = await this.chatService.isConversationMember(payload.conversationId, userId);
    if (!allowed) {
      client.emit('error', { message: '无权加入该会话' });
      return;
    }

    client.join(`conv_${payload.conversationId}`);
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(client: Socket, payload: { conversationId: number }) {
    client.leave(`conv_${payload.conversationId}`);
  }
}
