/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserNotification } from '../models/notification-schema';  // Ensure this points to the correct file
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { AuthGuard } from 'src/auth/guards/authentication.guards';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';


@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.Student, Role.Instructor)
  @UseGuards(authorizationGuard)
  @Get(':userId')
  async getUserNotifications(@Req () req): Promise<UserNotification[]> {
    const userId = req.cookies.userId;
    return this.notificationService.getUserNotifications(userId);
  }
   
  
  @Roles(Role.Student, Role.Instructor)
  @UseGuards(authorizationGuard)
  @UseGuards(AuthGuard)
  @Patch(':notificationId')
  async markAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markAsRead(notificationId);
  }
  @Roles(Role.Student, Role.Instructor)
  @UseGuards(authorizationGuard)
  @UseGuards(AuthGuard)
  @Get(':userId/unread')
  async getUnreadNotifications(@Req () req): Promise<UserNotification[]> {
    const userId = req.cookies.userId;
    return this.notificationService.getUnreadNotifications(userId);
  }


}
