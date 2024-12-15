/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';  // UserModule is already imported
import { ProgressModule } from './progress/progress.module';  // Import ProgressModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), ProgressModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    JwtStrategy,
    UserService,
  ],
})
export class AppModule {
  constructor() {
    console.log('JWT_SECRET1:', process.env.JWT_SECRET); // Log the secret value
    console.log('Port:',process.env.DATABASE)
  }
}
