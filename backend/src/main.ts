/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwtAuthGuard.guard';
import * as cookieParser from 'cookie-parser';

const mongoose=require('mongoose');
const express=require('express');
console.log('JWT_SECRET2:', process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect(process.env.DATABASE_URL , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error:', err);
  });
  app.use(express.json());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // Respect @Public()
  app.use(cookieParser());
  app.listen(3000);
}
bootstrap();
