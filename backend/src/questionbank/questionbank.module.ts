import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBankController } from './questionbank.controller';
import { QuestionBankService } from './questionbank.service';
import { QuizSchema } from '../../models/quizzes-schema';
import { ModuleSchema } from '../../models/module-schema';
import { QuestionBankSchema } from '../../models/questionbank-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'Question Bank', schema: QuestionBankSchema }])
  ],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
})
export class QuestionBankModule {}
