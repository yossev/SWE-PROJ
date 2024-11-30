import { WebSocketGateway, SubscribeMessage, MessageBody, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Socket, Server } from 'socket.io';
import { CreateMessageDto } from '../chat/dto/createMessage.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto, 
    client: Socket
  ): Promise<WsResponse<any>> {
    // Save the message in the database
    const message = await this.messageService.sendMessage(createMessageDto);

    // Emit the message to other users in the room
    client.broadcast.to(createMessageDto.roomId).emit('receive_message', message);
    return { event: 'receive_message', data: message };
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