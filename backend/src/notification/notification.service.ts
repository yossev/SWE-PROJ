/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../models/notification-schema';
import { Message } from '../models/message-schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>, 
    @InjectModel(Message.name) private messageModel: Model<Message>
  ) {}

  // Notify about a new course creation
  async notifyCourseCreation(
    userId: string,
    courseId: string,
    courseName: string
  ): Promise<Notification> {
    const message = `A new course "${courseName}" has been created.`;

    try {
      const notification = new this.notificationModel({
        userId,
        message,
        relatedMessageId: courseId, // Link the course ID for tracking
      });
      return await notification.save();
    } catch (error) {
      console.error('Error creating course notification:', error);
      throw new Error('Failed to create course notification');
    }
  }

  // Create a generic notification
  async createNotification(
    userId: string,
    message: string,
    relatedMessageId?: string
  ): Promise<Notification> {
    try {
      // If a relatedMessageId is provided, append its content to the notification
      if (relatedMessageId) {
        const relatedMessage = await this.messageModel.findById(relatedMessageId).lean();
        if (relatedMessage && relatedMessage.content) {
          message += `: "${relatedMessage.content}"`;
        }
      }

      const notification = new this.notificationModel({
        userId,
        message,
        relatedMessageId,
      });
      return await notification.save();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Get all notifications for a user
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  }

  // Get notifications with additional message content
  async getUserNotificationsWithMessages(userId: string): Promise<any[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .populate('relatedMessageId', 'content createdAt userId') // Populate message fields
      .exec();
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId), read: false })
      .select('message createdAt read')
      .exec();
  }
}
