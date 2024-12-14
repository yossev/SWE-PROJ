import {     MessageBody, OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Namespace , Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Logger , Req , Res , Get , Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { CreateMessageDto } from './dto/createMessage.dto';
import { Type } from 'class-transformer';


@WebSocketGateway({ cors: true })
export class MessageGateway implements OnGatewayConnection , OnGatewayDisconnect {

  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {
  }

  @WebSocketServer() server: Server;
  private readonly logger = new Logger(MessageGateway.name);
  clientIdArray = [];
  allCurrentRooms = [];
  

  handleConnection(client: Socket): void {
    const clients = this.server.sockets;
    this.server.emit('room', client.id + ' joined!')
    this.logger.log(`Client with ID: ${client.id} is connected!`);
  }

  async handleDisconnect(client: Socket) {
      this.server.emit('room', client.id + ' left!')
      this.logger.log(`Client with ID: ${client.id} is disconnected!`);
      let clientId = this.clientIdArray.find(i => i.client === client.id);
      if(clientId)
      {
        let self = this;
        this.allCurrentRooms.forEach(function(value) {
          const room = value.name;
          console.log("Room is: " + room);
          self.roomService.leaveRoom(room , clientId.id);
        })
      }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(@ConnectedSocket() client: Socket ,@MessageBody() body : {roomId : string , user : string , userId : string}): Promise<void> {
    console.log("ID is: " + body.userId);
    console.log(`User ${body.user} joined room ${body.roomId}`)
    const roomFound = this.allCurrentRooms.find(i => i.name === body.roomId);
    if(!roomFound)
    {
      this.allCurrentRooms.push({name : body.roomId});
    }
    this.clientIdArray.push({client : client.id , id : body.userId});
    client.join(body.roomId); // Join the room
    this.roomService.joinRoom(body.roomId , body.userId);
    this.server.to(body.roomId).emit('join_room' , `client ${body.user} has joined room : ${body.roomId}`);
  }

    // Leave a room
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(@ConnectedSocket() client: Socket , @MessageBody() body : {roomId : string , user : string , userId : string}): Promise<void> {
    client.leave(body.roomId); // Leave the room
    this.roomService.leaveRoom(body.roomId , body.userId);
    this.server.to(body.roomId).emit('leave_room' , `${body.user} has left room: ${body.roomId}`)
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@ConnectedSocket() client: Socket ,@MessageBody() body : {roomId : string , userId: string , user : string , message: string} ) {
    this.server.to(body.roomId).emit('sendMessage' , `${body.user} says: ${body.message}`);
    await this.messageService.sendMessage(new Types.ObjectId(body.userId) , body.message ,body.roomId , "group");
  }

  // Get chat history for a room
  @SubscribeMessage('get_chat_history')
  async handleGetHistory(@MessageBody() body: {roomId : string}, client: Socket): Promise<void> {
    const messages = await this.messageService.getMessagesByRoom(new Types.ObjectId(body.roomId));
    client.emit('chat_history', messages);
  }

    /*@SubscribeMessage('customName')
    handleMessage(client: Socket, message: any): void {
        this.client.emit('room', `[${client.id}] -> ${message}`);
    }*/




}
