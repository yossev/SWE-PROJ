import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { CourseModule } from './course/course.module';
import { InteractiveModule } from './module/module.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), CourseModule , InteractiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
