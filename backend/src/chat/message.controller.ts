import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dto/createMessage.dto';

@WebSocketGateway()
export class MessageController {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  // Handle sending messages (both group and private)
 // message.controller.ts
 @SubscribeMessage('send_message')
 async handleMessage(
   @MessageBody() createMessageDto: CreateMessageDto,
   client: Socket,
 ): Promise<WsResponse<any>> {
   const { userId, content, roomId, chatType, recipientId } = createMessageDto;
 
   const sender = await this.userService.findById(userId);
   if (!sender) {
     throw new Error('Sender not found.');
   }
 
   // Ensure roomId and recipientId are valid ObjectIds
   const savedMessage = await this.messageService.sendMessage(
     new Types.ObjectId(userId), // Ensure userId is an ObjectId
     content,
     new Types.ObjectId(roomId), // Ensure roomId is an ObjectId
     chatType,
     recipientId ? new Types.ObjectId(recipientId) : undefined, // Optional recipientId
   );
 
   // Broadcast the message
   if (chatType === 'group') {
     client.to(roomId).emit('receive_message', savedMessage);
   } else if (chatType === 'individual') {
     const privateRoomId = await this.roomService.generatePrivateRoomId(
       new Types.ObjectId(userId),
       new Types.ObjectId(recipientId),
     );
     client.to(privateRoomId).emit('receive_message', savedMessage);
 
     await this.notificationService.createNotification(
       recipientId,
       `New message from ${sender.name}`,
       savedMessage._id.toString(),
     );
   }
 
   return { event: 'receive_message', data: savedMessage };
 }
 
  // Join a room (group chat)
  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() roomId: string, client: Socket): void {
    client.join(roomId); // Join the room
  }

  // Leave a room
  @SubscribeMessage('leave_room')
  handleLeaveRoom(@MessageBody() roomId: string, client: Socket): void {
    client.leave(roomId); // Leave the room
  }

  // Get chat history for a room
  @SubscribeMessage('get_chat_history')
  async handleGetHistory(@MessageBody() roomId: string, client: Socket): Promise<void> {
    const messages = await this.messageService.getMessagesByRoom(new Types.ObjectId(roomId));
    client.emit('chat_history', messages);
  }
}
