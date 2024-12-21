/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBankController } from './questionbank.controller';
import { QuestionBankService } from './questionbank.service';
import { QuizSchema } from '../../src/models/quizzes-schema';
import { ModuleSchema } from 'src/models/module-schema';
import { QuestionBankSchema } from 'src/models/questionbank-schema';
import { UserSchema } from 'src/models/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Quiz', schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: 'QuestionBank', schema: QuestionBankSchema }]),
    MongooseModule.forFeature([{name: 'User' , schema : UserSchema}])
  ],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
})
export class QuestionBankModule {}
