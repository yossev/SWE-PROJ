import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizSchema } from '../../models/quizzes-schema';
import { ModuleSchema } from '../../models/module-schema';
import { QuestionBankSchema } from '../../models/questionbank-schema';
import { UserModule} from '../user/user/user.module';
import { UserSchema } from '../../models/user-schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'QuestionBank', schema: QuestionBankSchema },
      { name: 'User', schema: UserSchema } 
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
