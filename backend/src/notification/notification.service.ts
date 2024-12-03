/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
//contains all the functions that are used in creating and saving notifications
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../../models/notification-schema';
import { Message } from '../../models/message-schema';

@Injectable()
export class NotificationService {
   
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>, 
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}
// create a new notification
async createNotification(userId: string, message: string, relatedMessageId?: string): Promise<Notification> {
    let notificationMessage = message;
  
    try {
      // Fetch related message content if provided
      if (relatedMessageId) {
        const relatedMessage = await this.messageModel.findById(relatedMessageId).lean();
        if (relatedMessage && relatedMessage.content) {
          notificationMessage += `: "${relatedMessage.content}"`;
        }
      }
  
      // Create and save the notification
      const notification = new this.notificationModel({
        userId,
        message: notificationMessage,
        relatedMessageId,
      });
  
      return await notification.save(); // Return the saved notification
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification"); // Ensure an error is thrown if something goes wrong
    }
  }
  
  
// get all notification for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
// mark a notification as seen
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  }
  // get notification with message content
  async getUserNotificationsWithMessages(userId: string): Promise<any[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate('relatedMessageId', 'content createdAt userId') // Fetch related message fields
      .exec();
  }
  async getUnreadNotifications(user_id: string): Promise<Notification[]> {
    // Query the Notification collection using the user_id directly
    return this.notificationModel
      .find({ userId: new Types.ObjectId(user_id), read: false }) // Query notifications for this user with read status false
      .select('message createdAt read') 
      .exec();
  }
  
}
