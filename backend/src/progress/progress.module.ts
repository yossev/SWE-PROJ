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

import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/response/response.service';

import { CourseService } from 'src/course/course.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ModuleService } from 'src/module/module.service';
import { UserSchema } from 'src/models/user-schema';
import { ForumSchema } from 'models/forum-schema';

import { NotificationSchema } from 'models/notification-schema';
import { NotificationService } from 'src/notification/notification.service';
import { MessageService } from 'src/chat/message.service';
import { ForumService } from 'src/forum/forum.service';
import { QuestionBankSchema } from 'models/questionbank-schema';
import { MessageSchema } from 'models/message-schema';
import { UserService } from 'src/user/user.service';
import { RoomSchema } from 'models/room-schema';
import { RoomService } from 'src/room/room.service';
import { ThreadSchema } from 'models/thread-schema';
import { ThreadService } from 'src/thread/thread.service';
import { ReplySchema } from 'models/reply-schema';
import { ReplyService } from 'src/reply/reply.service';
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
      {name: 'Forum', schema: ForumSchema},
      {name:'UserNotification', schema:NotificationSchema},
      {name:'QuestionBank', schema:QuestionBankSchema},
      {name:'Message', schema:MessageSchema},
      {name:'Room', schema:RoomSchema},
      {name:'Reply', schema:ReplySchema},
      {name:'Thread', schema:ThreadSchema},

      

    ]), 



  ],
  controllers: [ProgressController],
  providers: [ProgressService, RatingService,JwtService,ResponseService,CourseService,QuizService,ModuleService,NotificationService,
    MessageService,ForumService,UserService,RoomService,ThreadService,ReplyService,AuthService
  ],
  exports: [ProgressService],
})
export class ProgressModule {}
