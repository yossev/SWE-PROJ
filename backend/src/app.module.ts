/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD for global guards
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ForumModule } from './forum/forum.module';
import { ThreadModule } from './thread/thread.module';
import { AuthGuard } from './auth/guards/authentication.guards';
import { JwtStrategy } from './auth/jwt.strategy';
import { User, UserSchema } from 'models/user-schema';
import * as dotenv from 'dotenv';
dotenv.config();

 // Import your custom AuthGuard

const url = "mongodb://localhost:27017/";
@Module({
  imports: [
    ConfigModule.forRoot({  envFilePath: '.env',isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>("habiba"),  // Ensure JWT_SECRET is defined in .env or config
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES') || '1h',  // Default expiration
        },
      }),
    }),
    MongooseModule.forRoot(url),
    UserModule, // Handles user-related logic
    AuthModule, // Handles authentication logic
    ForumModule,
    ThreadModule, // Handles forum and thread logic
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // Register AuthGuard globally
      useClass: AuthGuard,
    },JwtStrategy
  ],
  
})

export class AppModule {
  constructor() {
    console.log('JWT_SECRET1:', process.env.JWT_SECRET);  // Log the secret value
  }
}
