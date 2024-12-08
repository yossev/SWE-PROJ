import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './quiz/quiz.module';
import { UserModule} from './user/user/user.module';
import { QuestionBankModule } from './questionbank/questionbank.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), ProgressModule,  QuizModule , QuestionBankModule, ResponseModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
