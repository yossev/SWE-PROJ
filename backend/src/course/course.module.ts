/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  CourseSchema } from '../models/course-schema'; // Adjust the import based on your model location
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { NotificationService } from 'src/notification/notification.service';

import { ReplyService } from 'src/reply/reply.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { MessageService } from 'src/chat/message.service';
import { ForumService } from 'src/forum/forum.service';
import { ForumSchema } from 'src/models/forum-schema';
import { MessageSchema } from 'src/models/message-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { NotificationSchema } from 'src/models/notification-schema';
import { ProgressSchema } from 'src/models/progress-schema';
import { QuizSchema } from 'src/models/quizzes-schema';
import { RatingSchema } from 'src/models/rating-schema';
import { ReplySchema } from 'src/models/reply-schema';
import { ResponseSchema } from 'src/models/responses-schema';
import { RoomSchema } from 'src/models/room-schema';
import { ThreadSchema } from 'src/models/thread-schema';
import { ProgressService } from 'src/progress/progress.service';
import { RatingService } from 'src/rating/rating.service';
import { RoomService } from 'src/room/room.service';
import { ThreadService } from 'src/thread/thread.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema },
     { name: 'UserNotification', schema: NotificationSchema },
     {name: "Message", schema: MessageSchema },
     { name: "Room", schema: RoomSchema },
     { name: "Progress", schema: ProgressSchema},
     { name: "Responses", schema: ResponseSchema},
     { name: "Quiz", schema: QuizSchema },
     { name: "Module", schema: ModuleSchema},
     { name: "Rating", schema: RatingSchema},
     {name:"Forum",schema:ForumSchema},
     {name:"Thread",schema:ThreadSchema},
     {name:"Reply",schema:ReplySchema}
  ]),
  UserModule],
  controllers: [CourseController],
  providers: [CourseService, NotificationService, MessageService, UserService, RoomService, JwtService,
     ProgressService, AuthService, RatingService,ForumService,ThreadService,ReplyService

  ],
  exports:[CourseService]
})
export class CourseModule {}
