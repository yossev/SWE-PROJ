import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { UserModule } from './user/user.module';  // Ensure UserModule is imported
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserService } from './user/user.service';
import { AuthGuard } from '../src/auth/guards/authentication.guards';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UserModule,  // Import UserModule here
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
  }
}
