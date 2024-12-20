/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { quizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizSchema } from 'models/quizzes-schema';

import { ProgressModule } from 'src/progress/progress.module';
import { ProgressSchema } from '../../src/models/progress-schema';
import { ModuleSchema } from '../../src/models/module-schema';
import { QuestionBankSchema } from '../../src/models/questionbank-schema';
import { UserSchema } from '../../src/models/user-schema';
import { ResponseSchema } from 'models/responses-schema';
import { JwtService } from '@nestjs/jwt';
import { CourseSchema } from 'models/course-schema';
import { CourseService } from 'src/course/course.service';
import { NotificationSchema } from 'models/notification-schema';
import { NotificationService } from 'src/notification/notification.service';
import { Forum, ForumSchema } from 'models/forum-schema';
import { ForumService } from 'src/forum/forum.service';
import { MessageSchema } from 'models/message-schema';
import { MessageService } from 'src/chat/message.service';
import { UserService } from 'src/user/user.service';
import { ThreadSchema } from 'models/thread-schema';
import { ThreadService } from 'src/thread/thread.service';
import { ReplySchema } from 'src/models/reply-schema';
import { ReplyService } from 'src/reply/reply.service';
import { RoomService } from 'src/room/room.service';
import { RoomSchema } from 'src/models/room-schema';
import { AuthService } from 'src/auth/auth.service';
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
    ]),
    forwardRef(() => ProgressModule) 
  ],
  controllers: [quizController],
  providers: [QuizService,JwtService,CourseService,NotificationService,ForumService,MessageService,UserService,ThreadService,ReplyService,RoomService,AuthService],
})
export class QuizModule {}
