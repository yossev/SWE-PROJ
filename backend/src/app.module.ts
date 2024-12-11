/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
//import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';
import { ProgressModule } from './progress/progress.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
 // Ensure this path matches the actual file location

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE),
    AuthModule,
    UserModule,
    //CourseModule,
    ProgressModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
   
    // Remove JwtStrategy and UserService if they are already provided by AuthModule and UserModule
    // If needed, you can import them from their modules and provide here, but it's usually not necessary.
  ],
})
export class AppModule {
  constructor() {
    console.log('JWT_SECRET1:', process.env.JWT_SECRET); 
    console.log('Database URI:', process.env.DATABASE);
  }
}
