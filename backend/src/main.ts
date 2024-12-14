
require('dotenv').config();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './auth/guards/authentication.guards';
import { JwtService } from '@nestjs/jwt';
const mongoose=require('mongoose');
const express=require('express');
const url: string = "mongodb://localhost:27017/";


async function bootstrap() {

   console.log("Database URL:" , process.env.DATABASE);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await mongoose.connect(process.env.DATABASE , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error:', err);
  });
  app.use(express.json());
  const reflector = app.get(Reflector);
  console.log('Reflector in main.ts:', reflector);
  app.use(cookieParser());
  app.listen(3001);
}
bootstrap();

