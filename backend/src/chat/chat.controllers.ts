/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse } from "@nestjs/websockets";
import { Server,Socket } from 'socket.io'; 
import { RoomService } from "src/room/room.service";
import { MessageService } from "./chat.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { UserService } from "src/user/user.service";
import { NotificationService } from "src/notification/notification.service";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService, // Injecting RoomService
    private readonly jwtService: JwtService,
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
  @SubscribeMessage('join_room')
async handleJoinRoom(
  @MessageBody() roomId: string,
  client: Socket,
): Promise<void> {
  const user = client.data.user; // Retrieve the authenticated user
  // Add the user to the room
  client.join(roomId);
  this.server.to(roomId).emit('user_joined', { userId: user.id, roomId });
}
  @SubscribeMessage('leave_room')
  handleLeaveRoom(@MessageBody() roomId: string, client: Socket) {
    client.leave(roomId); // Remove user from the room
  }
  @SubscribeMessage('get_chat_history')
  async handleGetHistory(@MessageBody() roomId: string, client: Socket) {
    const messages = await this.messageService.getMessagesByRoom(roomId);
    client.emit('chat_history', messages); // Send the message history to the client
  }
}
