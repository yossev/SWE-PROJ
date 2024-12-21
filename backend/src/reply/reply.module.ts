/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { MessageService } from 'src/chat/message.service';
import { CourseService } from 'src/course/course.service';
import { ForumService } from 'src/forum/forum.service';
import { ProgressService } from 'src/progress/progress.service';
import { RatingService } from 'src/rating/rating.service';
import { RoomService } from 'src/room/room.service';
import { ThreadService } from 'src/thread/thread.service';
import { Forum, ForumSchema } from 'src/models/forum-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { ProgressSchema } from 'src/models/progress-schema';
import { QuizSchema } from 'src/models/quizzes-schema';
import { RatingSchema } from 'src/models/rating-schema';
import { ResponseSchema } from 'src/models/responses-schema';
import { Room, RoomSchema } from 'src/models/room-schema';
import { Course, CourseSchema } from 'src/models/course-schema';
import { Message, MessageSchema } from 'src/models/message-schema';
import { UserNotification, NotificationSchema } from 'src/models/notification-schema';
import { Reply, ReplySchema } from 'src/models/reply-schema';
import { Thread, ThreadSchema } from 'src/models/thread-schema';
import { User, UserSchema } from 'src/models/user-schema';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
;



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
  providers: [ReplyService,NotificationService,UserService,JwtService,CourseService, MessageService, RoomService,
       ProgressService, AuthService, RatingService,ForumService,ThreadService],
  controllers: [ReplyController],
  exports:[ReplyService]
})
export class ReplyModule {}
