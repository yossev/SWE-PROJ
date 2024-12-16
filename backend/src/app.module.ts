import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { ProgressModule } from './progress/progress.module';
import { ResponseController } from './response/response.controller';
import { RatingModule } from './rating/rating.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), ProgressModule, RatingModule, ResponseModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
