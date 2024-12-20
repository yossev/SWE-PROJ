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
import { ForumSchema } from 'models/forum-schema';
import { ModuleSchema } from 'models/module-schema';
import { QuestionBankSchema } from 'models/questionbank-schema';
import { QuizSchema } from 'models/quizzes-schema';
import { RatingSchema } from 'models/rating-schema';
import { ReplySchema } from 'models/reply-schema';
import { ResponseSchema } from 'models/responses-schema';
import { RoomSchema } from 'models/room-schema';
import { ThreadSchema } from 'models/thread-schema';
import { RatingService } from 'src/rating/rating.service';


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
