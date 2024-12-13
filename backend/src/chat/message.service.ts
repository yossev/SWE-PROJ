import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../models/message-schema';
import { Room } from '../models/room-schema';
import { NotificationService } from '../notification/notification.service';
import { UserService } from 'src/user/user.service';  // Import UserSer
import { RoomService } from 'src/room/room.service';
import { UserNotification } from 'models/notification-schema';
@Injectable()
export class MessageService {
 
  
  constructor(
    @InjectModel('Message') private readonly messageModel: Model<Message>,
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('UserNotification') private readonly notificationModel: Model<UserNotification>,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  // Save a new message to the database
  async saveMessage(userId: Types.ObjectId, content: string, roomId: Types.ObjectId): Promise<Message> {
    const newMessage = new this.messageModel({ userId, content, roomId });
    return await newMessage.save();
  }

  // Retrieve all messages from a specific room
  async getMessagesByRoom(roomId: Types.ObjectId): Promise<Message[]> {
    return this.messageModel.find({ roomId }).sort({ createdAt: 1 }); // Sorted by timestamp
  }

  // Send and notify users
  async sendMessage(userId: Types.ObjectId, content: string, roomId: Types.ObjectId, chatType: string, recipientId?: Types.ObjectId): Promise<Message> {
    const savedMessage = await this.saveMessage(userId, content, roomId);

    if (chatType === 'group') {
      await this.notifyUsersInRoom(roomId, userId, savedMessage);
    }

    if (chatType === 'individual' && recipientId) {
      await this.notificationService.createNotification(
        recipientId.toString(),
        `New message from ${userId}`,
        savedMessage._id.toString(),
      );
    }

    return savedMessage;
  }

  // Notify all users in the room except the sender
  private async notifyUsersInRoom(roomId: Types.ObjectId, userId: Types.ObjectId, message: Message) {
    const room = await this.roomModel.findById(roomId).populate('users');
    const usersInRoom = room.user_id.filter(user => user._id.toString() !== userId.toString());

    for (const user of usersInRoom) {
      await this.notificationService.createNotification(
        user._id.toString(),
        `New message in room ${roomId}: ${message.content}`,
        message._id.toString(),
      );
    }
  }
  
  
}
