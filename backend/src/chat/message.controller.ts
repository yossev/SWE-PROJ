import {     MessageBody, OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Namespace , Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { MessageService } from './message.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dto/createMessage.dto';

@WebSocketGateway({namespace : 'messages'})
export class MessageGateway implements OnGatewayConnection , OnGatewayDisconnect {

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Namespace;
  private readonly logger = new Logger(MessageGateway.name);

  handleConnection(client: Socket): void {
    const clients = this.server.sockets;
    this.server.emit('room', client.id + ' joined!')
    this.logger.log(`Client with ID: ${client.id} is connected!`);
    this.logger.log(`Number of connected sockets: ${clients.size}`)
  }

  handleDisconnect(client: Socket): void {
      this.server.emit('room', client.id + ' left!')
      this.logger.log(`Client with ID: ${client.id} is disconnected!`);

      const clients = this.server.sockets;
      this.logger.log(`Number of connected sockets: ${clients.size}`)
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket , roomId : string): void {
    console.log("Room ID is:" , roomId);
    client.join(roomId); // Join the room
    client.emit("Joined Room" , roomId);
    this.server.to(roomId).emit(`client ${client.id} has joined room : ${roomId}`);
  }

    // Leave a room
  @SubscribeMessage('leave_room')
  handleLeaveRoom(client: Socket , roomId : string): void {
    client.leave(roomId); // Leave the room
    client.emit("Left Room" , roomId);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(@ConnectedSocket() client: Socket , message : {room : string , sender: string , message: string} ) {
    console.log(message);
    this.server.to(message.room).emit('sendMessage' , `${message.sender} says : ${message.message}`);
  }

  // Get chat history for a room
  @SubscribeMessage('get_chat_history')
  async handleGetHistory(@MessageBody() roomId: string, client: Socket): Promise<void> {
    const messages = await this.messageService.getMessagesByRoom(new Types.ObjectId(roomId));
    client.emit('chat_history', messages);
  }

    /*@SubscribeMessage('customName')
    handleMessage(client: Socket, message: any): void {
        this.client.emit('room', `[${client.id}] -> ${message}`);
    }*/




}
