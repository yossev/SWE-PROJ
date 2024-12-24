import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingSchema } from '../../models/rating-schema';
import { ModuleSchema } from '../../models/module-schema';
import { CourseSchema } from '../../models/course-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }, { name: 'Module', schema: ModuleSchema },{ name: 'Course', schema: CourseSchema }, ]),
  ],
  controllers: [RatingController],
  providers: [RatingService],
})

 export class RatingModule {}
