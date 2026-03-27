import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  @IsNotEmpty()
  conversationId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  content: string;
}

export class StartConversationDto {
  @IsNumber()
  @IsNotEmpty()
  targetUserId: number;

  @IsOptional()
  @IsNumber()
  jobId?: number;

  @IsOptional()
  @IsString()
  content?: string;
}
