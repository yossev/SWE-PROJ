/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/models/user-schema';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken-schema';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    forwardRef(()=>UserModule),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule, forwardRef(() => UserModule)], // Support for circular dependencies with forwardRef
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'), // Load secret from configuration
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES') || '1h', // Default token expiration
        },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
       { name: RefreshToken.name, schema: RefreshTokenSchema },]), // Use Mongoose for User
  ],
  
  providers: [AuthService,JwtStrategy,UserService],
  exports: [JwtStrategy, PassportModule,JwtModule],  // Export for use in other modules
})
export class AuthModule {}
