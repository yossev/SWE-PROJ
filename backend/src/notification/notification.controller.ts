/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '../models/notification-schema';  // Ensure this points to the correct file
import { authorizationGuard } from 'src/auth/guards/authorization.guards';


@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}
  //@Roles(Role.User)
  @UseGuards(authorizationGuard)
  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':notificationId')
  async markAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }
  //@Roles(Role.User)
  @UseGuards(authorizationGuard)
  @Get(':userId/unread')
  async getUnreadNotifications(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationService.getUnreadNotifications(userId);
  }
}
