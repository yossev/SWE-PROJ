/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { quizController } from './quiz.controller';
import { QuizService } from './quiz.service';

import { ThreadService } from 'src/thread/thread.service';
import { ReplySchema } from 'src/models/reply-schema';
import { ReplyService } from 'src/reply/reply.service';
import { RoomService } from 'src/room/room.service';
import { RoomSchema } from 'src/models/room-schema';
import { AuthService } from 'src/auth/auth.service';
import { ProgressService } from 'src/progress/progress.service';

import { RatingService } from 'src/rating/rating.service';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from 'src/chat/message.service';
import { CourseService } from 'src/course/course.service';
import { ForumService } from 'src/forum/forum.service';
import { CourseSchema } from 'src/models/course-schema';
import { ForumSchema } from 'src/models/forum-schema';
import { MessageSchema } from 'src/models/message-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { NotificationSchema } from 'src/models/notification-schema';
import { ProgressSchema } from 'src/models/progress-schema';
import { QuestionBankSchema } from 'src/models/questionbank-schema';
import { QuizSchema } from 'src/models/quizzes-schema';
import { RatingSchema } from 'src/models/rating-schema';
import { ResponseSchema } from 'src/models/responses-schema';
import { ThreadSchema } from 'src/models/thread-schema';
import { UserSchema } from 'src/models/user-schema';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'QuestionBank', schema: QuestionBankSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Progress', schema: ProgressSchema} ,
      { name: 'Responses', schema: ResponseSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'UserNotification', schema: NotificationSchema },
      { name: 'Forum', schema: ForumSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'Thread', schema: ThreadSchema },
      { name: 'Reply', schema: ReplySchema },
      { name: 'Room', schema: RoomSchema },
      { name: 'Rating', schema: RatingSchema },
    ])
    //forwardRef(() => ProgressModule) 
  ],
  controllers: [quizController],
  providers: [QuizService,RatingService,JwtService,CourseService,NotificationService,ForumService,MessageService,UserService,ThreadService,ReplyService,RoomService,AuthService,ProgressService],
  exports:[QuizService]

})
export class QuizModule {}