import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {  CourseSchema } from '../models/course-schema'; // Adjust the import based on your model location
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationSchema } from 'models/notification-schema';
import { MessageService } from 'src/chat/message.service';
import { MessageSchema } from 'models/message-schema';
import { RoomSchema } from 'models/room-schema';
import { UserSchema } from 'models/user-schema';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { RoomService } from 'src/room/room.service';
import { JwtService } from '@nestjs/jwt';
import { ProgressService } from 'src/progress/progress.service';
import { AuthService } from 'src/auth/auth.service';
import { ProgressSchema } from 'models/progress-schema';
import { ResponseSchema } from 'models/responses-schema';
import { QuizSchema } from 'models/quizzes-schema';
import { ModuleSchema } from 'models/module-schema';
import { RatingSchema } from 'models/rating-schema';
import { RatingService } from 'src/rating/rating.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema },
     { name: 'Notification', schema: NotificationSchema },
     {name: "Message", schema: MessageSchema },
     { name: "Room", schema: RoomSchema },
     { name: "Progress", schema: ProgressSchema},
     { name: "Responses", schema: ResponseSchema},
     { name: "Quiz", schema: QuizSchema },
     { name: "Module", schema: ModuleSchema},
     { name: "Rating", schema: RatingSchema}
  ]),
  UserModule],
  controllers: [CourseController],
  providers: [CourseService, NotificationService, MessageService, UserService, RoomService, JwtService,
     ProgressService, AuthService, RatingService

  ],
})
export class CourseModule {}
