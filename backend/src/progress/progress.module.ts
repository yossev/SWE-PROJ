import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from '../../models/progress-schema';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import {Responses, ResponseSchema} from '../../models/responses-schema';
import { Course, CourseSchema } from '../../models/course-schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: Response.name, schema: ResponseSchema }, // Included the Response schema
      { name: Course.name, schema: CourseSchema }, // Included the Course schema
    ]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}