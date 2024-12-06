/* eslint-disable prettier/prettier */
//The service allows saving and retrieving messages while ensuring that
// users in a room are notified about new messages (except the sender).
// It integrates with a NotificationService to handle notifications for users in the room.
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../models/message-schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateMessageDto } from './dto/createMessage.dto';
import { NotificationService } from '../notification/notification.service'; 
import { Room } from '../models/room-schema'; 

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('Notification') private readonly notificationModel: Model<Notification>,
    private readonly notificationService: NotificationService,
    @InjectModel('Room') private readonly roomModel: Model<Room>, 
  ) {}

  // Save a new message to the database
  async saveMessage(userId: string, content: string, roomId: string): Promise<Message> {
    const newMessage = new this.messageModel({ userId, content, roomId });
    const savedMessage = await newMessage.save();
     return savedMessage;
  }

  /*async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    // Save the message to the database
    const { userId, content, roomId } = createMessageDto;
    const message = await this.saveMessage(userId, content, roomId);

    // Notify other users in the room (exclude the sender)
   const roomUsers = await this.getRoomUsers(roomId); // Assume this fetches users in the room
    const notifications = roomUsers
      .filter(user => user.id !== userId) // Exclude the sender
      .map(user => 
        this.notificationService.createNotification(user.id, `New message in room ${roomId}`)
      );

    await Promise.all(notifications); // Wait for all notifications to be created
    return message;
  }*/

  // Retrieve all messages from a specific room (or user-specific if needed)
  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.messageModel.find({ roomId }).sort({ createdAt: 1 }); // Sorted by timestamp
  }

  /*private async getRoomUsers(roomId: string): Promise<{ id: string }[]> {
    const room = await this.roomModel.findById(roomId).populate('users', '_id');
    if (!room) throw new Error('Room not found');
    return room.users.map(user => ({ id: user._id.toString() }));
  }*/
  
}
