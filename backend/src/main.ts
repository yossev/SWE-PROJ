/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './auth/guards/authentication.guards';
import { JwtService } from '@nestjs/jwt';

const mongoose=require('mongoose');
const express=require('express');
console.log('JWT_SECRET2:', process.env.JWT_SECRET);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect("mongodb://localhost:27017/" , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error:', err);
  });
  app.use(express.json());
  const reflector = app.get(Reflector);
  app.use(cookieParser());
  app.listen(3000);
}
bootstrap();
