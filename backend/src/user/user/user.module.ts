import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../../models/user-schema';
import { QuizModule } from 'src/quiz/quiz.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  exports: [MongooseModule], // Exporting MongooseModule to make it available in other modules
})
export class UserModule {}
