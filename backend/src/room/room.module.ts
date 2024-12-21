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
import { AuthService } from 'src/auth/auth.service';
import { Message, MessageSchema } from 'src/models/message-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { Progress, ProgressSchema } from 'src/models/progress-schema';
import { Quiz, QuizSchema } from 'src/models/quizzes-schema';
import { Rating, RatingSchema } from 'src/models/rating-schema';
import { Responses, ResponseSchema } from 'src/models/responses-schema';
import { User, UserSchema } from 'src/models/user-schema';
import { ProgressService } from 'src/progress/progress.service';
import { RatingService } from 'src/rating/rating.service';



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
