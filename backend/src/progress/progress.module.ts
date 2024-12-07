import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from 'models/course-schema';
import { ModuleSchema } from 'models/module-schema';
import { ProgressSchema } from 'models/progress-schema';
import { QuizSchema } from 'models/quizzes-schema';
import { ResponseSchema } from 'models/responses-schema';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Progress', schema: ProgressSchema },
      { name: 'Responses', schema: ResponseSchema }, // Included the Response schema
      { name: 'Course', schema: CourseSchema }, // Included the Course schema
      { name: 'Quiz', schema: QuizSchema }, 
      { name: 'Module', schema: ModuleSchema},
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
