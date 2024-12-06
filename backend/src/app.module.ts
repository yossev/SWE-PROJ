/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD for global guards
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ForumModule } from './forum/forum.module';
import { ThreadModule } from './thread/thread.module';
import { AuthGuard } from './auth/guards/authentication.guards';
 // Import your custom AuthGuard

const url = "mongodb://localhost:27017/";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: 'salmaa', // Use the same secret as in your AuthService
      signOptions: { expiresIn: '1h' }, // Optional: Set the token expiration time
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
    },
  ],
})
export class AppModule {}
