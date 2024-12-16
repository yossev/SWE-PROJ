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
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Responses', schema: ResponseSchema }, 
      { name: 'Course', schema: CourseSchema }, 
      { name: 'Quiz', schema: QuizSchema }, 
      { name: 'Module', schema: ModuleSchema},
      {name: 'Rating', schema: RatingSchema}
    ]), 
    QuizModule
  ],
  controllers: [ProgressController],
  providers: [ProgressService, RatingService],
  exports: [ProgressService],
})
export class ProgressModule {}
