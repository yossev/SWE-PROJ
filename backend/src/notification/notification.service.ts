/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {  UserNotification } from '../models/notification-schema';
import { Message } from '../models/message-schema';
import { Course } from 'models/course-schema';
import { User } from 'models/user-schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(UserNotification.name) private notificationModel: Model<UserNotification>, 
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService:UserService
  ) {}

  // Notify about a new course creation
  async notifyCourseCreation(
    courseId: string,
    courseName: string
  ): Promise<UserNotification> {
    const message = `A new course "${courseName}" has been created.`;
    const users=this.userService.findAll();
    try {
      const notification = new this.notificationModel({
        user_id: users,
        message,
        relatedMessageId: courseId, // Link the course ID for tracking
      });
      return await notification.save();
    } catch (error) {
      console.error('Error creating course notification:', error);
      throw new Error('Failed to create course notification');
    }
  }
  async notifyCourseUpdate(courseId: string, courseName: string): Promise<UserNotification> {
    try {
      // Fetch the course details
      const course = await this.courseModel.findById(courseId).exec();
  
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found.`);
      }
  
      const message = `The course "${courseName}" has been updated. Here are the updates: 
      Title: "${course.title}", 
      Description: "${course.description}", 
      Category: "${course.category}",
      Difficulty Level: "${course.difficulty_level}"`;
  
      // Notify each student
      for (const studentId of course.students as Types.ObjectId[]) {
        try {
          const student = await this.userModel.findById(studentId).exec();
          if (!student) {
            throw new Error(`Student with ID ${studentId} not found.`);
          }
  
          const notification = new this.notificationModel({
            user_id: studentId,
            message,
            relatedMessageId: courseId,
          });
  
          student.notifications.push(notification as UserNotification); // Push notification ID to student
          
          await student.save(); // Save updated student
          return await notification.save(); // Save notification
        } catch (error) {
          console.error(`Error notifying student ${studentId}:`, error);
        }
      }
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
  ): Promise<UserNotification> {
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
  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<UserNotification> {
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
  async getUnreadNotifications(userId: string): Promise<UserNotification[]> {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId), read: false })
      .select('message createdAt read')
      .exec();
  }
}
