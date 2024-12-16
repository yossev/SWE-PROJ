import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { quizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizSchema } from '../../models/quizzes-schema';
import { ModuleSchema } from '../../models/module-schema';
import { QuestionBankSchema } from '../../models/questionbank-schema';
import { UserModule} from '../user/user/user.module';
import { UserSchema } from '../../models/user-schema';
import { ProgressModule } from 'src/progress/progress.module';
import { ProgressSchema } from 'models/progress-schema';
import { ResponseSchema } from '../../models/responses-schema'; 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'QuestionBank', schema: QuestionBankSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Progress', schema: ProgressSchema} ,
      { name: 'Responses', schema: ResponseSchema },
    ]),
    forwardRef(() => ProgressModule) 
  ],
  controllers: [quizController],
  providers: [QuizService],
})
export class QuizModule {}
