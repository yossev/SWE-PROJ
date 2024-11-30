import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';      
import { QuizSchema } from '../../models/quizzes-schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }])],
  controllers: [ModuleController], 
  providers: [ModuleService],      
})
export class InteractiveModule {}
