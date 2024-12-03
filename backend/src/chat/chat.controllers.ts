/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse } from "@nestjs/websockets";
import { Socket } from 'socket.io'; 

import { Server } from "http";
import { RoomService } from "src/room/room.service";
import { MessageService } from "./chat.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { UserService } from "src/user/user.service";
import { NotificationService } from "src/notification/notification.service";
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService, // Injecting RoomService
  ) {}

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    client: Socket,
  ): Promise<WsResponse<any>> {
    // Fetch sender information
    const sender = await this.userService.findById(createMessageDto.userId);
    if (!sender) {
      throw new Error('Sender not found.');
    }
  
    let recipient = null;
    if (createMessageDto.chatType === 'individual') {
      recipient = await this.userService.findById(createMessageDto.recipientId);
      if (!recipient) {
        throw new Error('Recipient not found for individual chat.');
      }
      // Check if either sender or recipient is an instructor
      const isInstructorInvolved =
      sender.role === 'Instructor' || (recipient && recipient.role === 'Instructor');
       if (!isInstructorInvolved) {
        throw new Error('You do not have permission to send a message.');
       }
    }
    // Save the message
    const { userId, content, roomId } = createMessageDto;
    const savedMessage = await this.messageService.saveMessage(userId, content, roomId);
  
    // Broadcast the message based on chat type
    if (createMessageDto.chatType === 'group') {
      client.broadcast.to(roomId).emit('receive_message', savedMessage);
    } else if (createMessageDto.chatType === 'individual') {
      const individualRoomId = this.generateRoomId(userId, createMessageDto.recipientId);
      client.broadcast.to(individualRoomId).emit('receive_message', savedMessage);
  
      // Create a notification for the recipient
      await this.notificationService.createNotification(
        createMessageDto.recipientId,
        `New message from ${sender.name}`,
        savedMessage._id.toString(),
      );
    }
  
    // Return the message in the appropriate format
    return { event: 'receive_message', data: savedMessage };
  }
  

  private generateRoomId(senderId: string, recipientId: string): string {
    const ids = [senderId, recipientId].sort();
    return ids.join('-');
  }
}
