import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../models/message-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  providers: [MessageService, ChatGateway],
})
export class ChatModule {}