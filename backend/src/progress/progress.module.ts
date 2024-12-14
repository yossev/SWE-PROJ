import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from '../models/progress-schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import {ResponseSchema} from '../models/responses-schema';
import { CourseSchema } from '../models/course-schema';
import { QuizSchema } from '../models/quizzes-schema';
import {ModuleSchema } from '../models/module-schema';
import { RatingSchema } from '../models/rating-schema';
import { RatingService } from '../rating/rating.service';
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
  ],
  controllers: [ProgressController],
  providers: [ProgressService, RatingService],
  exports: [ProgressService],
})
export class ProgressModule {}
