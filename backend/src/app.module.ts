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
import { JwtStrategy } from './auth/jwt.strategy';
import { UserService } from './user/user.service';
import { AuthGuard } from './auth/guards/authentication.guards';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { APP_GUARD, Reflector } from '@nestjs/core';

import {BackupModule} from './backup/backup.module'
import { ChatModule } from './chat/message.module';
import { ForumModule } from './forum/forum.module';
import { ThreadModule } from './thread/thread.module';
import { ReplyModule } from './reply/reply.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE),
    AuthModule,
    UserModule,  // Ensure UserModule is imported here
    ProgressModule,  // Import ProgressModule to make ProgressService available,
    CourseModule,
    
    BackupModule,
    ChatModule,
    ForumModule,
    ThreadModule,
    ReplyModule
    
  ],
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
