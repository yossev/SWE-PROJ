/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserNotification } from '../models/notification-schema';  // Ensure this points to the correct file
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { AuthGuard } from 'src/auth/guards/authentication.guards';


@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getUserNotifications(userId);
  }
  @UseGuards(AuthGuard)
  @Patch(':notificationId')
  async markAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }
 
  @UseGuards(AuthGuard)
  @Get(':userId/unread')
  async getUnreadNotifications(@Param('userId') userId: string): Promise<UserNotification[]> {
    return this.notificationService.getUnreadNotifications(userId);
  }


}
