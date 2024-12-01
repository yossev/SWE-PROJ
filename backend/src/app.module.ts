import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
