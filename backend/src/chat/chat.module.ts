/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageService } from './chat.service';
import { ChatGateway } from './chat.controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../models/message-schema';
import { RoomSchema } from '../models/room-schema';
import { NotificationService } from "src/notification/notification.service";
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema },{ name: 'Room', schema: RoomSchema },])],
  providers: [MessageService, ChatGateway, RoomService,
    UserService,
    NotificationService,],
})
export class ChatModule {}