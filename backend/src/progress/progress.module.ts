/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from '../../src/models/progress-schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import {ResponseSchema} from '../../src/models/responses-schema';
import { CourseSchema } from '../../src/models/course-schema';
import { QuizSchema } from '../../src/models/quizzes-schema';
import {ModuleSchema } from '../../src/models/module-schema';
import { RatingSchema } from '../../src/models/rating-schema';
import { RatingService } from '../rating/rating.service';
import { QuizModule } from '../quiz/quiz.module';
import { JwtService } from '@nestjs/jwt';
import { ResponseService } from 'src/response/response.service';
import { Course } from 'models/course-schema';
import { CourseService } from 'src/course/course.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ModuleService } from 'src/module/module.service';
import { UserSchema } from 'src/models/user-schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Responses', schema: ResponseSchema }, 
      { name: 'Course', schema: CourseSchema }, 
      { name: 'Quiz', schema: QuizSchema }, 
      { name: 'Module', schema: ModuleSchema},
      {name: 'Rating', schema: RatingSchema},
      {name: 'User', schema: UserSchema}
    ]), 

  ],
  controllers: [ProgressController],
  providers: [ProgressService, RatingService,JwtService,ResponseService,CourseService,QuizService,ModuleService
  ],
  exports: [ProgressService],
})
export class ProgressModule {}
