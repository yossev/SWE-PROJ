/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD for global guards
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { ProgressModule } from './progress/progress.module';

 // Import your custom AuthGuard

const url = "mongodb://localhost:27017/";
@Module({
<<<<<<< HEAD
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
=======
  imports: [MongooseModule.forRoot("mongodb://localhost:27017/"), ProgressModule],
>>>>>>> origin/SWE-PROJ-Amani-Ghonim
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
