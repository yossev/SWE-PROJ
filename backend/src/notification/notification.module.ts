/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import {  NotificationSchema, UserNotification } from '../models/notification-schema';

import { RatingService } from 'src/rating/rating.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { CourseSchema } from 'src/models/course-schema';
import { ForumSchema } from 'src/models/forum-schema';
import { MessageSchema } from 'src/models/message-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { ProgressSchema } from 'src/models/progress-schema';
import { QuestionBankSchema } from 'src/models/questionbank-schema';
import { QuizSchema } from 'src/models/quizzes-schema';
import { RatingSchema } from 'src/models/rating-schema';
import { ReplySchema } from 'src/models/reply-schema';
import { ResponseSchema } from 'src/models/responses-schema';
import { RoomSchema } from 'src/models/room-schema';
import { ThreadSchema } from 'src/models/thread-schema';
import { UserSchema } from 'src/models/user-schema';
import { ProgressService } from 'src/progress/progress.service';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserNotification.name, schema: NotificationSchema },
      {name:'Message',schema:MessageSchema},
      {name:'Course',schema:CourseSchema},
      {name:'User',schema:UserSchema},
      {name:'Progress',schema:ProgressSchema},
      
            { name: 'Responses', schema: ResponseSchema }, 
            
            { name: 'Quiz', schema: QuizSchema }, 
            { name: 'Module', schema: ModuleSchema},
            {name: 'Rating', schema: RatingSchema},
            
            {name:"Forum",schema:ForumSchema},
                 {name:"Thread",schema:ThreadSchema},
                 {name:"Reply",schema:ReplySchema},
                 { name: 'UserNotification', schema: NotificationSchema },
                
                 {name:'QuestionBank',schema:QuestionBankSchema},
                 {name:'Room',schema:RoomSchema}
      
    ]),
  ],
  providers: [NotificationService,JwtService,ProgressService,AuthService,RatingService,UserService],
  exports: [NotificationService,JwtService], // Export the service so it can be used in other modules
})
export class NotificationModule {}
