/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { RefreshToken, RefreshTokenSchema } from 'src/models/refreshToken-schema'; // Use correct path
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule), // Resolve circular dependencies
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
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
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, JwtModule], // Export necessary services for other modules
})
export class AuthModule {}