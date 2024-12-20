/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../models/message-schema';
import { RoomSchema } from '../models/room-schema';
import { NotificationService } from "src/notification/notification.service";
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { UserNotification, NotificationSchema } from 'models/notification-schema';
import { JwtService } from '@nestjs/jwt';
import { Course, CourseSchema } from 'models/course-schema';
import { User, UserSchema } from 'models/user-schema';
import { ProgressService } from 'src/progress/progress.service';
import { AuthService } from 'src/auth/auth.service';
import { Progress, ProgressSchema } from 'models/progress-schema';
import { Responses, ResponseSchema } from 'models/responses-schema';
import { Quiz, QuizSchema } from 'models/quizzes-schema';
import { Module as module , ModuleSchema } from 'models/module-schema';
import { Rating, RatingSchema } from 'models/rating-schema';
import { RatingService } from 'src/rating/rating.service';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken-schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema },{ name: 'Room', schema: RoomSchema },
    { name: UserNotification.name, schema: NotificationSchema } , { name: Course.name, schema: CourseSchema } , 
    { name: User.name, schema: UserSchema } , { name: Progress.name, schema: ProgressSchema } , { name: Responses.name, schema: ResponseSchema },
    { name: Quiz.name, schema: QuizSchema } , { name: module.name, schema: ModuleSchema } , { name: Rating.name, schema: RatingSchema },
    { name: RefreshToken.name, schema: RefreshTokenSchema }
  ])],
  providers: [MessageService, MessageGateway, RoomService,
    UserService,
    NotificationService,
  JwtService , ProgressService , AuthService , RatingService],
  exports:[MessageService]
})
export class ChatModule {}