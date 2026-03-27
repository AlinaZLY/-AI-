import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { Job } from '../job/entities/job.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, User, Job]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
