import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { quizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizSchema } from 'models/quizzes-schema';

import { ProgressModule } from 'src/progress/progress.module';
import { ProgressSchema } from '../../src/models/progress-schema';
import { ModuleSchema } from '../../src/models/module-schema';
import { QuestionBankSchema } from '../../src/models/questionbank-schema';
import { UserSchema } from '../../src/models/user-schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'QuestionBank', schema: QuestionBankSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Progress', schema: ProgressSchema} 
    ]),
    forwardRef(() => ProgressModule) 
  ],
  controllers: [quizController],
  providers: [QuizService],
})
export class QuizModule {}
