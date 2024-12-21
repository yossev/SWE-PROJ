/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Forum, ForumSchema } from 'src/models/forum-schema';
import { Thread , ThreadSchema } from 'src/models/thread-schema';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';

import { AuthService } from 'src/auth/auth.service';
import { MessageService } from 'src/chat/message.service';
import { ProgressService } from 'src/progress/progress.service';
import { RatingService } from 'src/rating/rating.service';
import { RoomService } from 'src/room/room.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CourseService } from 'src/course/course.service';
import { ForumService } from 'src/forum/forum.service';
import { Course, CourseSchema } from 'src/models/course-schema';
import { Message, MessageSchema } from 'src/models/message-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { UserNotification, NotificationSchema } from 'src/models/notification-schema';
import { ProgressSchema } from 'src/models/progress-schema';
import { QuizSchema } from 'src/models/quizzes-schema';
import { RatingSchema } from 'src/models/rating-schema';
import { Reply, ReplySchema } from 'src/models/reply-schema';
import { ResponseSchema } from 'src/models/responses-schema';
import { Room, RoomSchema } from 'src/models/room-schema';
import { User, UserSchema } from 'src/models/user-schema';
import { NotificationService } from 'src/notification/notification.service';
import { ReplyService } from 'src/reply/reply.service';




@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reply.name, schema: ReplySchema },
      {name:Thread.name,schema:ThreadSchema},
      {name:UserNotification.name,schema:NotificationSchema},
      {name:Message.name,schema:MessageSchema},
      {name:Course.name,schema:CourseSchema},
      {name:User.name,schema:UserSchema},
      {name:Forum.name,schema:ForumSchema},
      {name:Room.name,schema:RoomSchema},
          { name: "Progress", schema: ProgressSchema},
           { name: "Responses", schema: ResponseSchema},
           { name: "Quiz", schema: QuizSchema },
           { name: "Module", schema: ModuleSchema},
           { name: "Rating", schema: RatingSchema},
    ]),
  ],
  controllers:[ThreadController],
  providers: [ThreadService,ReplyService,NotificationService,UserService,JwtService,CourseService, MessageService, RoomService,
       ProgressService, AuthService, RatingService,ForumService],
       exports:[ThreadService]
       
  })
  export class ThreadModule {}