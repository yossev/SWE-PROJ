import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const mongoose=require('mongoose');
const express=require('express');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect('mongodb://localhost:27017/' , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error: ', err);
  });
  app.use(express.json());
}
bootstrap();
