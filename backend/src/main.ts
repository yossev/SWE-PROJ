/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
  app.listen(3000);
}
bootstrap();
