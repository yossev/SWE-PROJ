import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const mongoose=require('mongoose');
const express=require('express');

const mongoUri = 'mongodb://localhost:27017/';

console.log('MongoDB URI:', process.env.MONGO_URI);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await mongoose.connect(mongoUri , {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  }).then( () => {
     console.log('Connected');
  }).catch((err) => {
     console.error('MongoDB connection error: ', err);
  });
  app.use(express.json());
  await app.listen(3000);
}
bootstrap();

