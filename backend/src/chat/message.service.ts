import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../models/message-schema';
import { CreateMessageDto } from '../chat/dto/createMessage.dto';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<Message>) {}

  // Save a new message to the database
  async saveMessage(userId: string, content: string, roomId: string): Promise<Message> {
    const newMessage = new this.messageModel({
      userId,
      content,
      roomId,
    });
    return newMessage.save();
  }
  async sendMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    // Save the message to the database
    const { userId, content, roomId } = createMessageDto;
    const message = await this.saveMessage(userId, content, roomId);

    return message;
  }

  // Retrieve all messages from a specific room (or user-specific if needed)
  async getMessagesByRoom(roomId: string): Promise<Message[]> {
    return this.messageModel.find({ roomId }).sort({ createdAt: 1 }); // Sorted by timestamp
  }
}