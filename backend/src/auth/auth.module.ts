/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; 

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/models/user-schema';
import { UserService } from 'src/user/user.service';
import { RefreshToken, RefreshTokenSchema } from 'models/refreshToken-schema';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
       { name: RefreshToken.name, schema: RefreshTokenSchema },]), // Use Mongoose for User
  ],
  
  providers: [AuthService, UserService,JwtStrategy],
  exports: [JwtStrategy, PassportModule,JwtModule],  // Export for use in other modules
})
export class AuthModule {}