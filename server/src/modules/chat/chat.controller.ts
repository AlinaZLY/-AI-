import { Controller, Get, Post, Body, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SendMessageDto, StartConversationDto } from './dto/send-message.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('conversations')
  async getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Post('conversations')
  async startConversation(@Req() req: any, @Body() dto: StartConversationDto) {
    const { conversation, isNew } = await this.chatService.getOrCreateConversation(req.user.id, dto.targetUserId, dto.jobId);
    let message: any = null;
    if (isNew && dto.content) {
      message = await this.chatService.sendMessage(conversation.id, req.user.id, dto.content);
    }
    return { conversation, message, isNew };
  }

  @Get('messages')
  async getMessages(
    @Req() req: any,
    @Query('conversationId', ParseIntPipe) conversationId: number,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.chatService.getMessages(
      conversationId, req.user.id,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 50,
    );
  }

  @Post('messages')
  async sendMessage(@Req() req: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(dto.conversationId, req.user.id, dto.content);
  }

  @Get('unread')
  async getUnreadCount(@Req() req: any) {
    return this.chatService.getUnreadTotal(req.user.id);
  }

  @Get('online-status')
  async getOnlineStatus(@Query('userIds') userIds: string) {
    const ids = (userIds || '').split(',').map(Number).filter(Boolean);
    const result: Record<number, { online: boolean; lastOnlineAt: string | null }> = {};
    for (const id of ids) {
      const online = this.chatGateway.isUserOnline(id);
      const user = await this.chatService.getUserLastOnline(id);
      result[id] = { online, lastOnlineAt: user?.lastOnlineAt?.toISOString() || null };
    }
    return result;
  }
}
