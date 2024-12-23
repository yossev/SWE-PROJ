import { RatingService } from '../rating/rating.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressSchema } from '../../models/progress-schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { ResponseSchema } from '../../models/responses-schema';
import { CourseSchema } from '../../models/course-schema';
import { QuizSchema } from '../../models/quizzes-schema';
import { ModuleSchema } from '../../models/module-schema';
import { RatingSchema } from '../../models/rating-schema';
import { RatingModule } from '../rating/rating.module'; // Import RatingModule
import { ResponseModule } from '../response/response.module';
import { UserSchema } from 'models/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Responses', schema: ResponseSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'Rating', schema: RatingSchema },
      {name:'User', schema: UserSchema}
    ]),
    RatingModule, // Import the RatingModule
    ResponseModule, // Import ResponseModule if needed
  ],
  controllers: [ProgressController],
  providers: [ProgressService, RatingService],
})
export class ProgressModule {}
