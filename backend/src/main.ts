/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const mongoose=require('mongoose');
const express=require('express');

const url = "mongodb://localhost:27017/";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect(url , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error:', err);
  });
  app.use(express.json());
}
bootstrap();
