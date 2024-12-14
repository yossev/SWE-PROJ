/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseSchema } from '../models/responses-schema';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Response', schema: ResponseSchema }]),  
  ],
  controllers: [ResponseController],  
  providers: [ResponseService],  
})
export class ResponseModule {}
