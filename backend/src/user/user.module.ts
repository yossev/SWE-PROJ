/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../../src/models/user-schema';
import { Course, CourseSchema } from '../../src/models/course-schema';
import { AuthModule } from 'src/auth/auth.module';
import { ProgressModule } from 'src/progress/progress.module';
import { ProgressService } from 'src/progress/progress.service';

@Module({
  imports: [
    forwardRef(() => AuthModule), // Resolve circular dependencies
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ProgressModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = process.env.JWT_SECRET; //config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        return {
          secret,
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES') || '1h',
          },
        };
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule], // Export UserService for use in AuthModule
})
export class UserModule {}