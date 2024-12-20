/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from '../../src/models/progress-schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import {ResponseSchema} from '../../src/models/responses-schema';
import { CourseSchema } from '../../src/models/course-schema';
import { QuizSchema } from '../../src/models/quizzes-schema';
import {ModuleSchema } from '../../src/models/module-schema';
import { RatingSchema } from '../../src/models/rating-schema';
import { RatingService } from '../rating/rating.service';
import { QuizModule } from '../quiz/quiz.module';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/response/response.service';
import { Course } from 'models/course-schema';
import { CourseService } from 'src/course/course.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ModuleService } from 'src/module/module.service';
import { UserSchema } from 'src/models/user-schema';
import { ForumSchema } from 'models/forum-schema';
import { ReplySchema } from 'models/reply-schema';
import { ThreadSchema } from 'models/thread-schema';
import { ForumService } from 'src/forum/forum.service';
import { ThreadService } from 'src/thread/thread.service';
import { ReplyService } from 'src/reply/reply.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationSchema } from 'models/notification-schema';
import { MessageSchema } from 'models/message-schema';
import { MessageService } from 'src/chat/message.service';
import { QuestionBankSchema } from 'models/questionbank-schema';
import { QuestionBankService } from 'src/questionbank/questionbank.service';
import { UserService } from 'src/user/user.service';
import { RoomSchema } from 'models/room-schema';
import { RoomService } from 'src/room/room.service';
import { AuthService } from 'src/auth/auth.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Responses', schema: ResponseSchema }, 
      { name: 'Course', schema: CourseSchema }, 
      { name: 'Quiz', schema: QuizSchema }, 
      { name: 'Module', schema: ModuleSchema},
      {name: 'Rating', schema: RatingSchema},
      {name: 'User', schema: UserSchema},
      {name:"Forum",schema:ForumSchema},
           {name:"Thread",schema:ThreadSchema},
           {name:"Reply",schema:ReplySchema},
           { name: 'UserNotification', schema: NotificationSchema },
           {name:"Message",schema:MessageSchema},
           {name:'QuestionBank',schema:QuestionBankSchema},
           {name:'Room',schema:RoomSchema}
           
    ]), 

  ],
  controllers: [ProgressController],
  providers: [ProgressService, RatingService,JwtService,ResponseService,CourseService,QuizService,ModuleService,ForumService,ThreadService,
    ReplyService,NotificationService,MessageService,QuestionBankService,UserService,RoomService,AuthService
  ],
  exports: [ProgressService],
})
export class ProgressModule {}
