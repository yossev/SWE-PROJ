import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { QuizModule } from './quiz/quiz.module';
import { UserModule} from './user/user/user.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), QuizModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
