/* eslint-disable prettier/prettier */
import { Module, Res } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingSchema } from '../models/rating-schema';
import { ModuleSchema } from 'models/module-schema';
import { ModuleService } from 'src/module/module.service';
import { CourseSchema } from 'models/course-schema';
import { CourseService } from 'src/course/course.service';
import { NotificationSchema } from 'models/notification-schema';
import { NotificationService } from 'src/notification/notification.service';
import { UserSchema } from 'models/user-schema';
import { UserService } from 'src/user/user.service';
import { ForumSchema } from 'models/forum-schema';
import { ForumService } from 'src/forum/forum.service';
import { MessageSchema } from 'models/message-schema';
import { MessageService } from 'src/chat/message.service';
import { JwtService } from '@nestjs/jwt';
import { ProgressService } from 'src/progress/progress.service';
import { ProgressSchema } from 'models/progress-schema';
import { AuthService } from 'src/auth/auth.service';
import { ReplySchema } from 'models/reply-schema';
import { ThreadSchema } from 'models/thread-schema';
import { RoomSchema } from 'models/room-schema';
import { RoomService } from 'src/room/room.service';

import { QuizSchema } from 'models/quizzes-schema';
import { QuizService } from 'src/quiz/quiz.service';
import { ResponseSchema } from 'models/responses-schema';
import { ResponseService } from 'src/response/response.service';
import { QuestionBankSchema } from 'models/questionbank-schema';
import { QuestionBankService } from 'src/questionbank/questionbank.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema },{ name: 'Module', schema: ModuleSchema },{name:'Course',schema:CourseSchema},{name:'Notification',schema:NotificationSchema},{name:'User',schema:UserSchema},{name:'Forum',schema:ForumSchema},
      {name:'Message',schema:MessageSchema},
      {name:'UserNotification',schema:NotificationSchema},
      {name:'Progress',schema:ProgressSchema},
      {name:'Reply',schema:ReplySchema},
      {name:'Thread',schema:ThreadSchema},
      {name:'Room',schema:RoomSchema},
      {name:'Responses',schema:ResponseSchema},
      {name:'Quiz',schema:QuizSchema},
      {name:'QuestionBank',schema:QuestionBankSchema}

    ]),
  ],
  controllers: [RatingController],
  providers: [RatingService,ModuleService,CourseService,NotificationService,UserService,ForumService,MessageService,NotificationService,
    JwtService,ProgressService,AuthService,RoomService,ResponseService,QuizService,QuestionBankService]
})

 export class RatingModule {}
