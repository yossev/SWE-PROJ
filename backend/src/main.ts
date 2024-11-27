import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require("dotenv");
const mongoose=require('mongoose');
const express=require('express');

const mongoUri = process.env.MONGODB_URI;
dotenv.config({ path: './.env' });

console.log('MongoDB URI:', process.env.MONGO_URI);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect(mongoUri , {
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error: ', err);
  });
  app.use(express.json());
}
bootstrap();
