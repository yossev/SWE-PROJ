import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });
const mongoose=require('mongoose');
const express=require('express');

const mongoUri = "mongodb://localhost:27017/";

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
  await app.listen(3001);
  app.use(express.json());
  
}
bootstrap();

