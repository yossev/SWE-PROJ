/* eslint-disable prettier/prettier */
 
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';      
import { QuizSchema } from '../../models/quizzes-schema';
import { ModuleSchema } from 'models/module-schema';
import { CourseSchema } from 'models/course-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
  MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }])],
  controllers: [ModuleController], 
  providers: [ModuleService],      
})
export class InteractiveModule {}
