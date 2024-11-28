import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizSchema } from '../../models/quizzes-schema';
import { ModuleSchema } from '../../models/module-schema';
import { QuestionBankSchema } from '../../models/questionbank-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Question Bank', schema: QuestionBankSchema }])
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
 
