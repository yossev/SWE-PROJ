/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD for global guards
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { AuthGuard } from '../src/auth/guards/authentication.guards';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASE_URL)],
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