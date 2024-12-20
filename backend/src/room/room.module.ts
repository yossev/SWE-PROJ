/* eslint-disable prettier/prettier */
// room.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { Course, CourseSchema } from 'src/models/course-schema';
import { Room, RoomSchema } from 'src/models/room-schema';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserSchema } from 'models/user-schema';
import { ProgressService } from 'src/progress/progress.service';
import { AuthService } from 'src/auth/auth.service';
import { Progress, ProgressSchema } from 'models/progress-schema';
import { Responses, ResponseSchema } from 'models/responses-schema';
import { Quiz, QuizSchema } from 'models/quizzes-schema';
import { ModuleSchema } from 'models/module-schema';
import { Rating, RatingSchema } from 'models/rating-schema';
import { RatingService } from 'src/rating/rating.service';
import { Message, MessageSchema } from 'models/message-schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema },
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: Responses.name, schema: ResponseSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Message.name, schema: MessageSchema }

    ]),
  

    //CourseModule, // Import the CourseModule to use Course services
  ],
  controllers: [RoomController],
  providers: [RoomService,UserService,JwtService,ProgressService,AuthService,RatingService],
  exports:[RoomService]
})
export class RoomModule {}
