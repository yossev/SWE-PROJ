/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageService } from './chat.service';
import { ChatGateway } from './chat.controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../models/message-schema';
import { RoomSchema } from '../../models/room-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema },{ name: 'Room', schema: RoomSchema },])],
  providers: [MessageService, ChatGateway],
})
export class ChatModule {}