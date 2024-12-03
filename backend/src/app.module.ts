/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const url = "mongodb://localhost:27017/";
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(url),
    UserModule, // Handles user-related logic
    AuthModule, // Handles authentication and authorization
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
