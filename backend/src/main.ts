import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const mongoose=require('mongoose');
const express=require('express');
const url: string = "mongodb://localhost:27017/";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect(url , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error: ', err);
  });
  app.use(express.json());
  await app.listen(3000);
}
bootstrap();
