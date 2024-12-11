/* eslint-disable prettier/prettier */
/*import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification-schema';  // Ensure this points to the correct file



@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}
  //@Roles(Role.User)
  
  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':notificationId')
  async markAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }
  //@Roles(Role.User)

  @Get(':userId/unread')
  async getUnreadNotifications(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationService.getUnreadNotifications(userId);
  }
}
*/