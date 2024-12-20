/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import {  NotificationSchema, UserNotification } from '../models/notification-schema';
import { MessageSchema } from 'models/message-schema';
import { CourseSchema } from 'models/course-schema';
import { UserSchema } from 'models/user-schema';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ProgressService } from 'src/progress/progress.service';
import { AuthService } from 'src/auth/auth.service';
import { ProgressSchema } from 'models/progress-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserNotification.name, schema: NotificationSchema },
      {name:'Message',schema:MessageSchema},
      {name:'Course',schema:CourseSchema},
      {name:'User',schema:UserSchema},
      {name:'Progress',schema:ProgressSchema},
      
    ]),
  ],
  providers: [NotificationService,UserService,JwtService,ProgressService,AuthService],
  exports: [NotificationService], // Export the service so it can be used in other modules
})
export class NotificationModule {}
