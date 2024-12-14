/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { RefreshToken, RefreshTokenSchema } from 'src/models/refreshToken-schema'; // Use correct path
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
     // Resolve circular dependencies
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),  // Ensure JWT_SECRET is defined in .env or config
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES') || '1h',  // Default expiration
        },
      }),
    }),forwardRef(() => UserModule),
  ],
  controllers:[AuthController],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService,JwtModule], // Export necessary services for other modules
})
export class AuthModule {}
