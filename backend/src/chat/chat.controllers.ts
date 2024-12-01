/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse } from "@nestjs/websockets";
import { Socket } from 'socket.io'; 

import { Server } from "http";
import { RoomService } from "src/room/room.service";
import { MessageService } from "./chat.service";
import { CreateMessageDto } from "./dto/createMessage.dto";
import { UserService } from "src/user/user.service";

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService, // Injecting RoomService
  ) {}

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    client: Socket,
  ): Promise<WsResponse<any>> {
    // Fetch sender and recipient information
    const sender = await this.userService.findById(createMessageDto.userId);
    let recipient;

    if (createMessageDto.chatType === 'individual') {
      recipient = await this.userService.findById(createMessageDto.recipientId);
    }

    // Check if either sender or recipient is an instructor
    if (
      (sender.role === 'Instructor') ||
      (recipient && recipient.role === 'Instructor')
    ) {
      // If either is an instructor, continue processing the message
      if (createMessageDto.chatType === 'group') {
        // Handle group message
        client.broadcast.to(createMessageDto.roomId).emit('receive_message', createMessageDto);
      } else if (createMessageDto.chatType === 'individual') {
        // Handle individual message (unique roomId based on user IDs)
        const roomId = this.generateRoomId(createMessageDto.userId, createMessageDto.recipientId);
        client.broadcast.to(roomId).emit('receive_message', createMessageDto);
      }

      // Return the message in the appropriate format
      return { event: 'receive_message', data: createMessageDto };
    } else {
      // If neither sender nor recipient is an instructor, you can reject the message or handle it differently
      throw new Error('You do not have permission to send a message.');
    }
  }

  private generateRoomId(senderId: string, recipientId: string): string {
    const ids = [senderId, recipientId].sort();
    return ids.join('-');
  }
}
