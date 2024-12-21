/* eslint-disable prettier/prettier */
 
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { QuizSchema } from '../../src/models/quizzes-schema';
import { ModuleSchema } from '../../src/models/module-schema';
import { QuestionBankSchema } from '../../src/models/questionbank-schema';
import { CourseSchema } from '../../src/models/course-schema';

import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { MessageService } from 'src/chat/message.service';
import { CourseService } from 'src/course/course.service';
import { ForumService } from 'src/forum/forum.service';
import { ProgressService } from 'src/progress/progress.service';
import { RatingService } from 'src/rating/rating.service';
import { ReplyService } from 'src/reply/reply.service';
import { RoomService } from 'src/room/room.service';
import { ThreadService } from 'src/thread/thread.service';
import { Forum, ForumSchema } from 'src/models/forum-schema';
import { ProgressSchema } from 'src/models/progress-schema';
import { RatingSchema } from 'src/models/rating-schema';
import { Reply, ReplySchema } from 'src/models/reply-schema';
import { ResponseSchema } from 'src/models/responses-schema';
import { Room, RoomSchema } from 'src/models/room-schema';
import { Thread, ThreadSchema } from 'src/models/thread-schema';
import { MessageSchema } from 'src/models/message-schema';
import { NotificationSchema } from 'src/models/notification-schema';
import { UserSchema } from 'src/models/user-schema';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Question Bank', schema: QuestionBankSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'UserNotification', schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([
          { name: Reply.name, schema: ReplySchema },
          {name:Thread.name,schema:ThreadSchema},
          {name:Forum.name,schema:ForumSchema},
          {name:Room.name,schema:RoomSchema},
              { name: "Progress", schema: ProgressSchema},
               { name: "Responses", schema: ResponseSchema},
               { name: "Rating", schema: RatingSchema},
        ]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService,NotificationService,UserService,CourseService, NotificationService, MessageService, UserService, RoomService, JwtService,
       ProgressService, AuthService, RatingService,ForumService,ThreadService,ReplyService
  ],
  exports:[ModuleService]
})
export class InteractiveModule {}