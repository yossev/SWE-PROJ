/* eslint-disable prettier/prettier */
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
;
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'models/user-schema';
import { RolesGuard } from './guards/roles.guard';
import { LocalStrategy } from './middleware/local.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard,LocalStrategy,],
  exports: [AuthService],
})
export class AuthModule {}